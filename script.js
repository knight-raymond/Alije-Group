function init() {
    /* ================= HEADER SHRINK ================= */
    const header = document.getElementById("header");
    header && window.addEventListener("scroll", () => {
        header.classList.toggle("shrink", window.scrollY > 50);
    });


    /* ================= SIDEBAR ================= */
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("openSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    function openSidebar() {
        if (!sidebar) return;
        sidebar.classList.add("open");
        document.body.classList.add("no-scroll");
    }

    function closeSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove("open");
        document.body.classList.remove("no-scroll");
    }

    openBtn && openBtn.addEventListener("click", openSidebar);
    closeBtn && closeBtn.addEventListener("click", closeSidebar);

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
    setActiveLink();


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
        if (e.target === fullscreenView) {
            fullscreenView.classList.remove("active");
        }
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
