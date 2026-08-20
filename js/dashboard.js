function showStatus(el, message, isError) {
    el.textContent = message;
    el.hidden = false;
    el.className = "status-msg " + (isError ? "error" : "success");
}

function renderListItem(list, { title, meta, onDelete }) {
    const li = document.createElement("li");
    li.className = "dash-list-item";

    const info = document.createElement("span");

    const strong = document.createElement("strong");
    strong.textContent = title;

    const metaEl = document.createElement("span");
    metaEl.className = "meta";
    metaEl.textContent = meta;

    info.appendChild(strong);
    info.appendChild(metaEl);

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn";
    deleteBtn.setAttribute("aria-label", "Delete");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener("click", onDelete);

    li.appendChild(info);
    li.appendChild(deleteBtn);
    list.appendChild(li);
}

function initUploadForm() {
    const form = document.getElementById("upload-form");
    const status = document.getElementById("upload-status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const category = document.getElementById("file-category").value;
        const year = document.getElementById("file-year").value;
        const semester = document.getElementById("file-semester").value;
        const title = document.getElementById("file-title").value.trim();
        const file = document.getElementById("file-input").files[0];

        if (!file) {
            showStatus(status, "Please select a PDF file.", true);
            return;
        }

        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        const safeName = file.name.replace(/\s+/g, "-");
        const path = `${Date.now()}-${safeName}`;

        const { error: uploadError } = await supabase.storage
            .from(category)
            .upload(path, file);

        if (uploadError) {
            showStatus(status, uploadError.message, true);
            submitBtn.disabled = false;
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from(category)
            .getPublicUrl(path);

        const { error: insertError } = await supabase.from("files").insert({
            category,
            year,
            semester,
            title,
            file_path: path,
            file_url: publicUrlData.publicUrl,
        });

        submitBtn.disabled = false;

        if (insertError) {
            showStatus(status, insertError.message, true);
            return;
        }

        showStatus(status, "File published successfully.", false);
        form.reset();
        loadFiles();
    });
}

function initAnnouncementForm() {
    const form = document.getElementById("announcement-form");
    const status = document.getElementById("announcement-status");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const title = document.getElementById("announcement-title").value.trim();
        const content = document.getElementById("announcement-content-input").value.trim();

        const submitBtn = form.querySelector("button[type=submit]");
        submitBtn.disabled = true;

        const { error } = await supabase.from("announcements").insert({ title, content });

        submitBtn.disabled = false;

        if (error) {
            showStatus(status, error.message, true);
            return;
        }

        showStatus(status, "Announcement published.", false);
        form.reset();
        loadAnnouncements();
    });
}

async function loadFiles() {
    const list = document.getElementById("file-list");
    const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

    list.innerHTML = "";

    if (error) {
        list.innerHTML = `<li class="dash-list-empty"></li>`;
        list.firstChild.textContent = error.message;
        return;
    }

    if (!data.length) {
        list.innerHTML = `<li class="dash-list-empty">No files uploaded yet.</li>`;
        return;
    }

    data.forEach((file) => {
        renderListItem(list, {
            title: file.title,
            meta: `${file.category} · Year ${file.year} · Semester ${file.semester}`,
            onDelete: () => deleteFile(file.id, file.category, file.file_path),
        });
    });
}

async function deleteFile(id, category, path) {
    if (!confirm("Delete this file?")) return;

    await supabase.storage.from(category).remove([path]);
    await supabase.from("files").delete().eq("id", id);

    loadFiles();
}

async function loadAnnouncements() {
    const list = document.getElementById("announcement-list");
    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

    list.innerHTML = "";

    if (error) {
        list.innerHTML = `<li class="dash-list-empty"></li>`;
        list.firstChild.textContent = error.message;
        return;
    }

    if (!data.length) {
        list.innerHTML = `<li class="dash-list-empty">No announcements published yet.</li>`;
        return;
    }

    data.forEach((item) => {
        renderListItem(list, {
            title: item.title,
            meta: item.content,
            onDelete: () => deleteAnnouncement(item.id),
        });
    });
}

async function deleteAnnouncement(id) {
    if (!confirm("Delete this announcement?")) return;
    await supabase.from("announcements").delete().eq("id", id);
    loadAnnouncements();
}

(async () => {
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
        location.href = "login.html";
        return;
    }

    document.documentElement.style.visibility = "visible";

    const userEmail = document.getElementById("user-email");
    if (userEmail) userEmail.textContent = data.session.user.email;

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn?.addEventListener("click", async () => {
        await supabase.auth.signOut();
        location.href = "login.html";
    });

    initUploadForm();
    initAnnouncementForm();
    loadFiles();
    loadAnnouncements();
})();
