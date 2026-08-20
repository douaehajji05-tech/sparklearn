document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    if (!form) return;

    const errorBox = document.getElementById("auth-error");
    const submitBtn = form.querySelector(".auth-submit");
    const submitLabel = submitBtn.querySelector(".btn-label");

    supabase.auth.getSession().then(({ data }) => {
        if (data.session) location.href = "dashboard.html";
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        errorBox.hidden = true;
        submitBtn.disabled = true;
        submitLabel.textContent = "Signing in...";

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            errorBox.textContent = error.message;
            errorBox.hidden = false;
            submitBtn.disabled = false;
            submitLabel.textContent = "Sign In";
            return;
        }

        location.href = "dashboard.html";
    });
});
