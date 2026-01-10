function init() {

    /* ================= HEADER SHRINK ================= */
    window.addEventListener("scroll", () => {
        const header = document.querySelector("#header header");
        header && header.classList.toggle("shrink", window.scrollY > 50);
    });


    /* ================= SIDEBAR ================= */
    function openSidebar() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;
        sidebar.classList.add("open");
        document.body.classList.add("no-scroll");
    }

    function closeSidebar() {
        const sidebar = document.getElementById("sidebar");
        if (!sidebar) return;
        sidebar.classList.remove("open");
        document.body.classList.remove("no-scroll");
    }

    document.addEventListener("click", (e) => {
        if (e.target.closest("#openSidebar")) openSidebar();
        if (e.target.closest("#closeSidebar")) closeSidebar();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 920) closeSidebar();
    });


    /* ================= ACTIVE LINK ================= */
    function setActiveLink() {
        const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
        document.querySelectorAll(".nav-links a, .sidebar a").forEach(a => {
            const href = a.getAttribute("href")?.split("/").pop().toLowerCase();
            a.classList.toggle("active-link", href === current);
        });
    }
    setTimeout(setActiveLink, 50);


    /* ================= FAQ ================= */
    document.querySelectorAll(".faq-item").forEach(item => {
        const q = item.querySelector(".faq-question");
        const a = item.querySelector(".faq-answer");

        q && q.addEventListener("click", () => {
            item.classList.toggle("active");
            a.style.display = a.style.display === "block" ? "none" : "block";
        });
    });


    /* ================= FULLSCREEN IMAGE PREVIEW ================= */
    const images = document.querySelectorAll(".photo-item img");
    const fullscreenView = document.getElementById("fullscreenView");
    const fullscreenImg = document.getElementById("fullscreenImg");
    const previewCloseBtn = document.getElementById("previewcloseBtn");

    images.forEach(img => {
        img.addEventListener("click", () => {
            fullscreenImg.src = img.src;
            fullscreenView.classList.add("active");
        });
    });

    previewCloseBtn && previewCloseBtn.addEventListener("click", () => {
        fullscreenView.classList.remove("active");
    });

    fullscreenView && fullscreenView.addEventListener("click", e => {
        if (e.target === fullscreenView) fullscreenView.classList.remove("active");
    });

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            fullscreenView && fullscreenView.classList.remove("active");
            closeSidebar();
        }
    });
}

/* INIT ON LOAD */
document.addEventListener("DOMContentLoaded", init);