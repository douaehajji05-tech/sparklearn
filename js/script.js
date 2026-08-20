document.addEventListener("DOMContentLoaded", async () => {
    const { data, error } = await supabase.auth.getSession();

    console.log("Session:", data);
    console.log("Error:", error);
});