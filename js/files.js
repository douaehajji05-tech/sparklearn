document.addEventListener("DOMContentLoaded", async () => {
    const mounts = document.querySelectorAll(".file-list-mount");
    if (!mounts.length) return;

    const category = mounts[0].dataset.category;

    const { data, error } = await supabase
        .from("files")
        .select("*")
        .eq("category", category)
        .order("created_at", { ascending: false });

    if (error || !data) return;

    mounts.forEach((mount) => {
        const year = mount.dataset.year;
        const semester = mount.dataset.semester;

        const matches = data.filter((file) => {
            if (year && String(file.year) !== String(year)) return false;
            if (semester && String(file.semester) !== String(semester)) return false;
            return true;
        });

        if (!matches.length) return;

        mount.innerHTML = "";

        matches.forEach((file) => {
            const link = document.createElement("a");
            link.href = file.file_url;
            link.target = "_blank";
            link.rel = "noopener";
            link.className = "file-link";

            const fileIcon = document.createElement("i");
            fileIcon.className = "fa-solid fa-file-pdf";

            const label = document.createElement("span");
            label.textContent = file.title;

            const downloadIcon = document.createElement("i");
            downloadIcon.className = "fa-solid fa-arrow-down-to-line";

            link.appendChild(fileIcon);
            link.appendChild(label);
            link.appendChild(downloadIcon);
            mount.appendChild(link);
        });
    });
});
