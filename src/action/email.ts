"use server";

import { createClient } from "@supabase/supabase-js";
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Create nodemailer transporter with error handling
function createEmailTransporter(): Transporter {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not found in environment variables');
  }

  // Fixed: Use createTransport instead of createTransporter
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
    // Add these for better reliability
    secure: true,
    tls: {
      rejectUnauthorized: false
    }
  });
}

export async function sendVerificationCode(email: string): Promise<{
  error?: string;
  messageId?: string;
  message?: string;
}> {
  console.log('=== STARTING EMAIL SEND PROCESS ===');
  console.log('Target email:', email);
  console.log('Gmail user:', process.env.GMAIL_USER);
  
  // Input validation
  if (!email) {
    return { error: "Email is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Delete any existing codes for this email first
    console.log('Deleting existing verification codes...');
    await supabaseAdmin
      .from("verification_codes")
      .delete()
      .eq("email", email);
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated verification code:', verificationCode);
    
    // Create expiration time (10 minutes from now)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    console.log('Code expires at:', expiresAt.toISOString());

    // Save to database
    console.log('Saving to database...');
    const { error } = await supabaseAdmin
      .from("verification_codes")
      .insert([{ 
        email, 
        code: verificationCode, 
        expires_at: expiresAt.toISOString()
      }]);

    if (error) {
      console.error("Database error:", error);
      return { error: `Failed to save verification code: ${error.message}` };
    }
    console.log('Database save successful');

    // Send email using nodemailer
    console.log('Creating email transporter...');
    const transporter = createEmailTransporter();
    
    // Verify transporter before sending
    try {
      await transporter.verify();
      console.log('Transporter verified successfully');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      return { error: "Email service configuration error. Please try again later." };
    }
    
    const mailOptions = {
      from: `"Foodie App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Your Foodie Verification Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Foodie Verification Code</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f9f9f9;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #f97316; font-size: 36px; margin: 0; font-family: serif;">🍔 Foodie</h1>
                <p style="color: #666; font-size: 14px; margin: 5px 0 0 0; letter-spacing: 1px;">MADE BY FOOD LOVER</p>
              </div>
              
              <!-- Main Content -->
              <div style="text-align: center;">
                <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to Foodie!</h2>
                <p style="font-size: 16px; color: #666; line-height: 1.5; margin-bottom: 30px;">
                  Thank you for signing up! Please use the verification code below to complete your registration:
                </p>
                
                <!-- Verification Code Box -->
                <div style="background-color: #f3f4f6; padding: 30px; border-radius: 8px; margin: 30px 0; border: 2px dashed #f97316;">
                  <div style="font-size: 42px; color: #f97316; margin: 0; letter-spacing: 8px; font-family: 'Courier New', monospace; font-weight: bold;">
                    ${verificationCode}
                  </div>
                </div>
                
                <!-- Instructions -->
                <div style="background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <p style="font-size: 14px; color: #92400e; margin: 0;">
                    ⏰ This code will expire in <strong>10 minutes</strong>
                  </p>
                </div>
                
                <p style="font-size: 14px; color: #666; margin: 20px 0;">
                  🔒 Please do not share this code with anyone for security reasons.
                </p>
              </div>
              
              <!-- Footer -->
              <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px 0;">
              <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
                If you didn't request this code, please ignore this email or contact our support team.
              </p>
              <p style="font-size: 12px; color: #999; text-align: center; margin: 10px 0 0 0;">
                © 2024 Foodie App. Made with ❤️ by food lovers.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to Foodie!

Your verification code is: ${verificationCode}

This code will expire in 10 minutes. Please do not share this code with anyone for security reasons.

If you didn't request this code, please ignore this email.

© 2024 Foodie App`
    };

    console.log('Sending email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    
    // Close the transporter
    transporter.close();
    
    return { 
      messageId: info.messageId,
      message: `Verification code sent to ${email}` 
    };
    
  } catch (emailError: any) {
    console.error("=== EMAIL SENDING ERROR ===");
    console.error('Error type:', emailError?.constructor?.name);
    console.error('Error message:', emailError?.message);
    console.error('Error code:', emailError?.code);
    console.error('Full error:', emailError);
    
    // Handle specific Gmail errors
    if (emailError?.code === 'EAUTH') {
      return { error: "Gmail authentication failed. Please check your app password." };
    }
    
    if (emailError?.code === 'ECONNECTION') {
      return { error: "Failed to connect to Gmail. Please check your internet connection." };
    }
    
    if (emailError?.code === 'EMESSAGE') {
      return { error: "Invalid email message format." };
    }
    
    if (emailError?.responseCode === 550) {
      return { error: "Invalid email address. Please check the email and try again." };
    }

    if (emailError?.responseCode === 553) {
      return { error: "Email rejected by recipient server." };
    }

    if (emailError?.responseCode === 554) {
      return { error: "Email rejected due to policy reasons." };
    }
    
    return { error: `Failed to send email: ${emailError?.message || 'Unknown error'}` };
  }
}

export async function verifyCode(email: string, code: string): Promise<{
  error?: string;
}> {
  console.log(`=== VERIFYING CODE ===`);
  console.log(`Email: ${email}, Code: ${code}`);
  
  // Input validation
  if (!email || !code) {
    return { error: "Email and verification code are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }

  if (!/^\d{6}$/.test(code)) {
    return { error: "Verification code must be 6 digits." };
  }
  
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Database query error:", error);
      
      // Handle specific Supabase errors
      if (error.code === 'PGRST116') {
        return { error: "Invalid verification code. Please check your code and try again." };
      }
      
      return { error: "Database error occurred. Please try again." };
    }

    if (!data) {
      console.error("No verification code found");
      return { error: "Invalid verification code. Please check your code and try again." };
    }

    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    
    console.log('Current time (UTC):', now.toISOString());
    console.log('Expires at (UTC):', expiresAt.toISOString());
    console.log('Time difference (minutes):', (expiresAt.getTime() - now.getTime()) / (1000 * 60));

    if (now.getTime() > expiresAt.getTime()) {
      console.log('Code expired - deleting it');
      try {
        await supabaseAdmin.from("verification_codes").delete().eq("id", data.id);
      } catch (deleteError) {
        console.error('Error deleting expired code:', deleteError);
      }
      return { error: "Verification code has expired. Please request a new code." };
    }

    console.log('✅ Code verified successfully');
    return {};
    
  } catch (error: any) {
    console.error('Verify code error:', error);
    return { error: "Failed to verify code. Please try again." };
  }
}

export async function verifyCodeAndSignup(
  email: string, 
  code: string, 
  password: string, 
  username?: string
): Promise<{
  error?: string;
  userId?: string;
  message?: string;
}> {
  console.log('=== STARTING COMPLETE SIGNUP PROCESS ===');
  console.log(`Email: ${email}, Username: ${username}`);
  
  // Input validation
  if (!email || !code || !password) {
    return { error: "Email, verification code, and password are required." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }

  if (!/^\d{6}$/.test(code)) {
    return { error: "Verification code must be 6 digits." };
  }
  
  try {
    // Step 1: Verify the email code
    console.log('Step 1: Verifying code...');
    const verifyResult = await verifyCode(email, code);
    if (verifyResult.error) {
      console.log('Code verification failed:', verifyResult.error);
      return { error: verifyResult.error };
    }

    // Step 2: Create the user account
    console.log('Step 2: Creating user account...');
    try {
      const { signupUser } = await import('./server-auth');
      const signupResult = await signupUser(email, password, username);
      if (signupResult.error) {
        console.log('User creation failed:', signupResult.error);
        return { error: signupResult.error };
      }

      // Step 3: Clean up verification code
      console.log('Step 3: Cleaning up verification code...');
      const supabaseAdmin = getSupabaseAdmin();
      try {
        await supabaseAdmin
          .from("verification_codes")
          .delete()
          .eq("email", email)
          .eq("code", code);
      } catch (cleanupError) {
        console.error('Error cleaning up verification code:', cleanupError);
        // Don't fail the signup for cleanup errors
      }

      console.log('✅ Complete signup process successful');
      console.log('User ID:', signupResult.userId);
      
      return { 
        userId: signupResult.userId,
        message: "Account created successfully!" 
      };
      
    } catch (importError) {
      console.error('Error importing server-auth:', importError);
      return { error: 'Server configuration error. Please try again.' };
    }
    
  } catch (error: any) {
    console.error('=== SIGNUP PROCESS ERROR ===');
    console.error('Error:', error);
    return { error: 'Signup process failed. Please try again.' };
  }
}

// Helper function to test email configuration
export async function testEmailConfiguration(testEmail?: string): Promise<{
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
}> {
  console.log('=== TESTING EMAIL CONFIGURATION ===');
  
  try {
    const transporter = createEmailTransporter();
    
    // Verify the transporter configuration
    try {
      const verified = await transporter.verify();
      console.log('Transporter verified:', verified);
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      return { success: false, error: 'Email configuration verification failed' };
    }
    
    if (testEmail) {
      console.log('Sending test email to:', testEmail);
      try {
        const info = await transporter.sendMail({
          from: `"Foodie App Test" <${process.env.GMAIL_USER}>`,
          to: testEmail,
          subject: 'Foodie Email Configuration Test',
          html: '<h1>✅ Email Configuration Working!</h1><p>Your Gmail integration is working correctly.</p>',
          text: 'Email Configuration Working! Your Gmail integration is working correctly.'
        });
        
        console.log('Test email sent:', info.messageId);
        transporter.close();
        return { success: true, messageId: info.messageId };
      } catch (sendError) {
        console.error('Test email send failed:', sendError);
        transporter.close();
        return { success: false, error: `Test email failed: ${sendError.message}` };
      }
    }
    
    transporter.close();
    return { success: true, message: 'Email configuration verified' };
    
  } catch (error: any) {
    console.error('Email configuration test failed:', error);
    return { success: false, error: error.message };
  }
}
