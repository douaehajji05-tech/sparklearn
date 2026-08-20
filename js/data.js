document.addEventListener("DOMContentLoaded", async () => {
    const mount = document.getElementById("announcement-mount");
    if (!mount) return;

    const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);

    if (error || !data || !data.length) return;

    mount.innerHTML = "";

    data.forEach((item) => {
        const card = document.createElement("div");
        card.className = "announcement-item";

        const title = document.createElement("h4");
        title.textContent = item.title;

        const text = document.createElement("p");
        text.textContent = item.content;

        card.appendChild(title);
        card.appendChild(text);
        mount.appendChild(card);
    });
});
