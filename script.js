/* ============================================================
   Alije Group — script.js  (Final, Bug-Fixed)
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  /* ── HEADER SHRINK ── */
  const header = document.getElementById("site-header");
  if (header) {
    window.addEventListener("scroll", () => {
      header.classList.toggle("shrink", window.scrollY > 50);
    }, { passive: true });
  }

  /* ── SCROLL TO TOP ── */
  const scrollTopBtn = document.getElementById("scrollTop");
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── SIDEBAR ── */
  function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const btn = document.getElementById("openSidebar");
    if (!sidebar) return;
    sidebar.classList.add("open");
    sidebar.setAttribute("aria-hidden", "false");
    if (btn) btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }

  function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const btn = document.getElementById("openSidebar");
    if (!sidebar) return;
    sidebar.classList.remove("open");
    sidebar.setAttribute("aria-hidden", "true");
    if (btn) btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  const openBtn = document.getElementById("openSidebar");
  const closeBtn = document.getElementById("closeSidebar");
  if (openBtn) openBtn.addEventListener("click", openSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeSidebar);

  // Close sidebar on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 920) closeSidebar();
  });

  /* ── ACTIVE NAV LINK (dynamic — works on any host/protocol) ── */
  // FIX: was defaulting to "index.html" when pathname was empty (some file:// servers)
  // Now also handles trailing slash and index.html equivalence
  const rawPage = location.pathname.split("/").pop() || "";
  const current = rawPage === "" || rawPage === "index.html" ? "index.html" : rawPage.toLowerCase();
  document.querySelectorAll(".nav-links a, .sidebar a").forEach(a => {
    const rawHref = (a.getAttribute("href") || "").split("/").pop().split("#")[0].toLowerCase();
    const href = rawHref === "" ? "index.html" : rawHref;
    // Toggle: add active if match, remove if not — respects hardcoded class too
    if (href === current) {
      a.classList.add("active-link");
    } else {
      a.classList.remove("active-link");
    }
  });

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll(".faq-item").forEach(item => {
    const q = item.querySelector(".faq-question");
    const a = item.querySelector(".faq-answer");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");
      // Close all open items
      document.querySelectorAll(".faq-item.active").forEach(other => {
        other.classList.remove("active");
        const ans = other.querySelector(".faq-answer");
        if (ans) ans.style.display = "none";
      });
      // Toggle clicked item
      item.classList.toggle("active", !isOpen);
      a.style.display = isOpen ? "none" : "block";
    });
  });

  /* ── MODAL CLOSE (delegated — products page) ── */
  function closeModal() {
    const modal = document.getElementById("productModal");
    if (!modal) return;
    modal.classList.remove("open");
    document.body.classList.remove("no-scroll");
  }
  // Expose globally for any inline callers
  window.closeModal = closeModal;

  /* ── DELEGATED CLICK HANDLER ── */
  document.addEventListener("click", e => {
    // Close product modal via X button
    if (e.target.closest("#modalClose")) { closeModal(); return; }
    // Close product modal by clicking backdrop
    const modal = document.getElementById("productModal");
    if (modal && e.target === modal) { closeModal(); return; }
    // Thumbnail swap inside modal
    const thumb = e.target.closest(".modal-thumb");
    if (thumb && modal && modal.classList.contains("open")) {
      document.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
      const mainImg = document.getElementById("modalMainImg");
      if (mainImg) mainImg.src = thumb.dataset.src;
      return;
    }
  });

  /* ── KEYBOARD SHORTCUTS ── */
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      closeSidebar();
    }
  });

  /* ── SCROLL-REVEAL ANIMATION ── */
  // FIX: capped stagger delay so last card never waits >0.5s
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    document.querySelectorAll(
      ".card, .feature-card, .faq-item, .mission-card, .contact-info-card, .cat-card, .infra-card, .pg-card"
    ).forEach((el, i) => {
      // FIX: cap delay at 0.4s so last of 38 cards doesn't wait 2.6s
      const delay = Math.min(i * 0.06, 0.4);
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = `opacity 0.4s ease ${delay}s, transform 0.4s ease ${delay}s`;
      revealObserver.observe(el);
    });
  }

  /* ── PRODUCT FILTER (products.html) ── */
  function applyFilter(cat) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    const activeBtn = document.querySelector(`.filter-btn[data-cat="${cat}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    let visible = 0;
    document.querySelectorAll(".pg-card").forEach(card => {
      const show = cat === "all" || card.dataset.cat === cat;
      card.dataset.hidden = show ? "false" : "true";
      if (show) visible++;
    });
    const empty = document.getElementById("pgEmpty");
    if (empty) empty.style.display = visible === 0 ? "block" : "none";
  }

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.cat));
  });

  /* ── PRODUCTS PAGE: read category from URL hash ── */
  // FIX: was using sessionStorage (unreliable) — now uses location.hash
  const hash = location.hash.replace("#", "").trim();
  if (hash && document.querySelector(`.filter-btn[data-cat="${hash}"]`)) {
    applyFilter(hash);
    // Smoothly scroll to the filter bar (not the anchor element)
    setTimeout(() => {
      const filterBar = document.getElementById("filterBar");
      if (filterBar) filterBar.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

});
