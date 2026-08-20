document.addEventListener("DOMContentLoaded", () => {
    const mount = document.getElementById("footer");
    if (!mount) return;

    mount.innerHTML = `
        <div class="footer-wave"></div>

        <div class="container">

            <div class="footer-grid">

                <div class="footer-about">
                    <div class="footer-logo"><i class="fa-solid fa-book-open"></i> SparkLearn</div>
                    <p class="footer-tagline">Empowering Engineering Students</p>
                    <p class="footer-desc">
                        A centralized platform for engineering students to access exams,
                        resources, scholarships and academic reports.
                    </p>
                </div>

                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <div class="footer-links-grid">
                        <ul class="footer-links">
                            <li><a href="exams.html"><i class="fa-solid fa-arrow-right"></i> Exams</a></li>
                            <li><a href="resources.html"><i class="fa-solid fa-arrow-right"></i> Resources</a></li>
                            <li><a href="scholarships.html"><i class="fa-solid fa-arrow-right"></i> Scholarships</a></li>
                        </ul>
                        <ul class="footer-links">
                            <li><a href="vocabulary.html"><i class="fa-solid fa-arrow-right"></i> Vocabulary</a></li>
                            <li><a href="reports.html"><i class="fa-solid fa-arrow-right"></i> Reports</a></li>
                            <li><a href="weekly.html"><i class="fa-solid fa-arrow-right"></i> Weekly Exercises</a></li>
                        </ul>
                    </div>
                </div>

                <div class="footer-col">
                    <h3>Contact</h3>
                    <ul class="footer-contact">
                        <li><i class="fa-solid fa-envelope"></i> douaehajji05@gmail.com</li>
                        <li><i class="fa-solid fa-location-dot"></i> Morocco</li>
                    </ul>
                </div>

            </div>

            <hr>

            <p class="copyright">
                © ${new Date().getFullYear()} SparkLearn. All rights reserved.
            </p>

        </div>
    `;
});
