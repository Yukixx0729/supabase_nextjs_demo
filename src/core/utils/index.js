const production = process.env.NODE_ENV === "production";

export const SITE_URL = production
  ? "https://supabase-nextjs-demo-aoqg.vercel.app/"
  : "http://localhost:3000";
