import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Use anon key for user sessions
    {
      cookies: {
        getAll() {
          const allCookies: { name: string; value: string }[] = [];
          // Iterate over the cookieStore to get all cookies
          for (const [name, value] of cookieStore as any) { // Cast to any to bypass TS error if it persists
            allCookies.push({ name, value });
          }
          return allCookies;
        },
        async setAll(cookiesToSet) { // Make setAll async
          try {
            const awaitedCookieStore = await cookieStore; // Await here
            cookiesToSet.forEach(({ name, value, options }) =>
              awaitedCookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
