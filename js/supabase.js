// Guarded against double-execution (e.g. Live Server re-injecting the
// script on save without a full page reload). If this file ever runs
// twice in the same page context, the second run just reuses the
// existing client instead of re-declaring it and crashing.
if (!window.supabaseClient) {
    const SUPABASE_URL = "https://jxmusjefejnxuhzuovcm.supabase.co";
    const SUPABASE_KEY = "sb_publishable_lqrgvfvTQiUgIKmdR9rSZw_7e0u0puC";

    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );
}

// Convenience local reference (safe: it's `var`, so redeclaring it
// on a second run is just a no-op reassignment, not a SyntaxError).
var supabase = window.supabaseClient;