import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role for server actions
    {
      cookies: {
        getAll() {
          return [];
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
