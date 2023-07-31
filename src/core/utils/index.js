const production = process.env.NODE_ENV === "production";

export const SITE_URL = production
  ? "https://supabase-nextjs-demo-ir3jks82h-yukixx0729.vercel.app"
  : "http://localhost:3000";
