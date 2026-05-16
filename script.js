/* ============================================================
   Alije Group — script.js (Improved & Bug-Fixed)
   ============================================================ */

function init() {

  /* ─── HEADER SHRINK ─── */
  const header = document.querySelector("#header header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("shrink", window.scrollY > 50);
    }, { passive: true });
  }

  /* ─── SCROLL TO TOP ─── */
  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ─── SIDEBAR ─── */
  function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const btn = document.getElementById("openSidebar");
    if (!sidebar) return;
    sidebar.classList.add("open");
    sidebar.setAttribute("aria-hidden", "false");
    btn && btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const btn = document.getElementById("openSidebar");
    if (!sidebar) return;
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden", "true");
    btn && btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  document.getElementById("openSidebar")?.addEventListener("click", openSidebar);
  document.getElementById("closeSidebar")?.addEventListener("click", closeSidebar);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeSidebar();
  });

  /* ─── ACTIVE LINK ─── */
  function setActiveLink() {
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    document.querySelectorAll(".nav-links a, .sidebar a").forEach(a => {
      const href = (a.getAttribute("href") || "").split("/").pop().toLowerCase();
      a.classList.toggle("active-link", href === current);
    });
  }
  setTimeout(setActiveLink, 50);

  /* ─── FAQ ─── */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-question");
    const a = item.querySelector(".faq-answer");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      // Close all others
      document.querySelectorAll(".faq-item.active").forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
          other.querySelector(".faq-answer").style.display = "none";
        }
      });
      item.classList.toggle("active", !isOpen);
      a.style.display = isOpen ? "none" : "block";
    });
  });

  /* ─── FULLSCREEN IMAGE PREVIEW ─── */
  const fullscreenView  = document.getElementById("fullscreenView");
  const fullscreenImg   = document.getElementById("fullscreenImg");
  const previewCloseBtn = document.getElementById("previewcloseBtn");

  function openFullscreen(src, alt) {
    if (!fullscreenImg || !fullscreenView) return;
    fullscreenImg.src = src;
    fullscreenImg.alt = alt || "Product image";
    fullscreenView.classList.add("active");
    document.body.classList.add("no-scroll");
    previewCloseBtn && previewCloseBtn.focus();
  }

  function closeFullscreen() {
    if (!fullscreenView) return;
    fullscreenView.classList.remove("active");
    document.body.classList.remove("no-scroll");
  }

  // Use event delegation on the gallery — works even if DOM mutates
  document.addEventListener("click", e => {
    const img = e.target.closest(".photo-item img") || e.target.closest(".photo-item")?.querySelector("img");
    if (img) { openFullscreen(img.src, img.alt); return; }
    if (e.target.closest("#previewcloseBtn")) { closeFullscreen(); return; }
    if (e.target === fullscreenView) { closeFullscreen(); }
  });

  /* ─── KEYBOARD NAVIGATION ─── */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeFullscreen();
      closeSidebar();
    }
  });

  /* ─── CARD REVEAL ANIMATION ─── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".card, .feature-card, .faq-item, .mission-card, .contact-info-card").forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(28px)";
    el.style.transition = `opacity 0.45s ease ${i * 0.06}s, transform 0.45s ease ${i * 0.06}s`;
    observer.observe(el);
  });
}

document.addEventListener("DOMContentLoaded", init);
