document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("navbar");
    if (!mount) return;

    const currentPage = location.pathname.split("/").pop() || "index.html";

    const links = [
        { href: "index.html", label: "Home" },
        { href: "exams.html", label: "Exams" },
        { href: "resources.html", label: "Resources" },
        { href: "scholarships.html", label: "Scholarships" },
        { href: "vocabulary.html", label: "Vocabulary" },
        { href: "reports.html", label: "Reports" },
        { href: "weekly.html", label: "Weekly" },
    ];

    const navLinks = links
        .map(
            (link) =>
                `<li><a href="${link.href}"${
                    link.href === currentPage ? ' class="active"' : ""
                }>${link.label}</a></li>`
        )
        .join("");

    mount.innerHTML = `
        <div class="container">
            <nav>
                <a href="index.html" class="logo-group">
                    <span class="logo-icon"><i class="fa-solid fa-book-open"></i></span>
                    <span class="logo-text">
                        SparkLearn
                        <small>Empowering Engineering Students</small>
                    </span>
                </a>

                <ul class="nav-links">${navLinks}</ul>

                <a href="login.html" class="login-btn">
                    <i class="fa-solid fa-user"></i> <span>Login</span>
                </a>
            </nav>
        </div>
    `;
});
