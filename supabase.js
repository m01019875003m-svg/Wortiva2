const SUPABASE_URL = "https://umsgajmoppfpbrchkscr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_BkbY3bCoe4xilzaMgZsN1w_YpwmxzGH";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );