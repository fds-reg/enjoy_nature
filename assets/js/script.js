// ================================================================
// SCRIPT.JS — Enjoy Nature v2.0
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initFadeInOnScroll();
  initStatCounters();
  initGalleryFilter();
  initGalleryLightbox();
  initContactForm();
  initTeamGrid();
  initTripModal();
  initOrderDropdown();
  initScrollProgress();
  markBodyLoaded();
});

/* ================================================================
   DATA ANGGOTA TIM (dipakai hanya jika halaman punya <div id="team-grid">
   tanpa kartu manual — team.html saat ini memakai kartu manual dengan
   atribut data-*, jadi fungsi ini otomatis tidak melakukan apa-apa
   di halaman itu).
   ================================================================ */
const teamMembers = [
  {
    name: "Dian Pratama",
    role: "Trip Leader & Pelari",
    photo: "assets/img/team-1.jpg",
    bio: "Sudah memimpin lebih dari 20 open trip pendakian dan aktif lari half marathon sejak 2022."
  },
  {
    name: "Rara Wulandari",
    role: "Fotografer Perjalanan",
    photo: "assets/img/team-2.jpg",
    bio: "Mendokumentasikan setiap momen trip lewat foto, hobi hiking dan menyelam."
  },
  {
    name: "Bima Saputra",
    role: "Logistik & Surfing Coach",
    photo: "assets/img/team-3.jpg",
    bio: "Mengurus perlengkapan setiap trip, juga melatih surfing untuk pemula."
  },
  {
    name: "Citra Maharani",
    role: "Koordinator Komunitas",
    photo: "assets/img/team-4.jpg",
    bio: "Menghubungkan komunitas pelari dan pendaki lewat berbagai acara rutin."
  }
];

/* ================================================================
   1. NAVBAR — scroll effect + hamburger animated
   ================================================================ */
function initNavbar() {
  const navbar   = document.querySelector(".navbar");
  const toggle   = document.querySelector(".nav-toggle");
  const nav      = document.querySelector(".navbar nav");

  if (!navbar) return;

  // Scroll effect: add .scrolled class
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Hamburger open/close with animated lines (the toggle needs 3 <span> children)
  if (toggle && nav) {
    // Ensure toggle has 3 spans for animation if they don't exist yet
    if (toggle.children.length === 0) {
      toggle.innerHTML = "<span></span><span></span><span></span>";
    }

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", isOpen);
    });

    // Close when a nav link is clicked
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.classList.remove("active");
        toggle.setAttribute("aria-expanded", false);
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!navbar.contains(e.target)) {
        nav.classList.remove("open");
        toggle.classList.remove("active");
      }
    });
  }
}

/* ================================================================
   2. FADE-IN ON SCROLL — stagger child elements
   ================================================================ */
function initFadeInOnScroll() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        // Stagger direct children (cards, stat-cards, etc.)
        const children = entry.target.querySelectorAll(
          ".card, .stat-card, .team-card, .trip-card, .pillar-card, .gallery-item, .timeline-item"
        );
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.08}s`;
          child.style.opacity = "0";
          child.style.transform = "translateY(24px)";
          setTimeout(() => {
            child.style.transition = "opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1)";
            child.style.opacity = "1";
            child.style.transform = "translateY(0)";
          }, 30 + i * 80);
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ================================================================
   3. STAT COUNTER ANIMATION — easeOutCubic
   ================================================================ */
function initStatCounters() {
  const counters = document.querySelectorAll(".stat-number");
  if (!counters.length) return;

  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duration = 1600;
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutCubic(progress);
      el.textContent = Math.floor(eased * target).toLocaleString("id-ID");
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString("id-ID");
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ================================================================
   4. GALLERY FILTER
   ================================================================ */
function initGalleryFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const items   = document.querySelectorAll(".gallery-item");
  if (!buttons.length || !items.length) return;

  // Show all on load
  items.forEach((item) => item.classList.add("show"));

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      items.forEach((item, i) => {
        const match = filter === "all" || item.getAttribute("data-category") === filter;
        if (match) {
          item.style.animationDelay = `${i * 0.04}s`;
          item.classList.add("show");
        } else {
          item.classList.remove("show");
        }
      });
    });
  });
}

/* ================================================================
   5. GALLERY LIGHTBOX
   ================================================================ */
function initGalleryLightbox() {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  // Create lightbox DOM
  const lb = document.createElement("div");
  lb.className = "gallery-lightbox";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `
    <button class="lightbox-close" aria-label="Tutup">&times;</button>
    <img src="" alt="Gallery preview" />
  `;
  document.body.appendChild(lb);

  const lbImg   = lb.querySelector("img");
  const lbClose = lb.querySelector(".lightbox-close");

  const openLb = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  const closeLb = () => {
    lb.classList.remove("open");
    document.body.style.overflow = "";
    setTimeout(() => { lbImg.src = ""; }, 300);
  };

  items.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img) openLb(img.src, img.alt);
    });
  });

  lbClose.addEventListener("click", closeLb);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lb.classList.contains("open")) closeLb();
  });
}

/* ================================================================
   6. CONTACT FORM — validation + feedback
   ================================================================ */
function initContactForm() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const statusEl = form.querySelector(".form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name    = form.querySelector("#name")?.value.trim();
    const email   = form.querySelector("#email")?.value.trim();
    const message = form.querySelector("#message")?.value.trim();

    if (!name || !email || !message) {
      showStatus(statusEl, "⚠️ Mohon lengkapi semua kolom.", false);
      shakeForm(form);
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showStatus(statusEl, "⚠️ Format email tidak valid.", false);
      return;
    }

    // Simulate sending
    const btn = form.querySelector("button[type='submit']");
    if (btn) {
      btn.textContent = "Mengirim...";
      btn.disabled = true;
    }

    setTimeout(() => {
      showStatus(statusEl, "✅ Pesan terkirim! Terima kasih, kami akan segera menghubungi Anda.", true);
      form.reset();
      if (btn) { btn.textContent = "Kirim Pesan"; btn.disabled = false; }
    }, 1200);
  });
}

function showStatus(el, text, success) {
  if (!el) return;
  el.textContent = text;
  el.style.color = success ? "#3d6b3d" : "#c1622d";
  el.style.background = success ? "rgba(61,107,61,0.08)" : "rgba(193,98,45,0.08)";
}

function shakeForm(form) {
  form.style.animation = "none";
  form.offsetHeight; // reflow
  form.style.animation = "shake 0.4s ease";
  if (!document.getElementById("shakeStyle")) {
    const s = document.createElement("style");
    s.id = "shakeStyle";
    s.textContent = `@keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }`;
    document.head.appendChild(s);
  }
}

/* ================================================================
   7. TEAM GRID & MODAL (versi generik — hanya aktif jika halaman
   punya <div id="team-grid">. Di team.html saat ini kartu tim dibuat
   manual di HTML dan modal-nya diatur oleh script inline di
   team.html, jadi fungsi ini tidak melakukan apa-apa di sana.)
   ================================================================ */
function initTeamGrid() {
  const grid = document.getElementById("team-grid");
  if (!grid) return;

  grid.innerHTML = teamMembers
    .map(
      (m, i) => `
      <div class="team-card fade-child" data-index="${i}">
        <img src="${m.photo}" alt="${m.name}" onerror="this.src='logo.png'" />
        <div class="team-card-info">
          <h4>${m.name}</h4>
          <span>${m.role}</span>
        </div>
      </div>
    `
    )
    .join("");

  const overlay   = document.getElementById("team-modal-overlay");
  const closeBtn  = document.getElementById("team-modal-close");
  const mPhoto    = document.getElementById("team-modal-photo");
  const mName     = document.getElementById("team-modal-name");
  const mRole     = document.getElementById("team-modal-role");
  const mBio      = document.getElementById("team-modal-bio");

  if (!overlay) return;

  grid.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("click", () => {
      const m     = teamMembers[+card.getAttribute("data-index")];
      mPhoto.src  = m.photo;
      mPhoto.alt  = m.name;
      mName.textContent = m.name;
      mRole.textContent = m.role;
      mBio.textContent  = m.bio;
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) closeModal();
  });
}

/* ================================================================
   8. ORDER DROPDOWN
   ================================================================ */
function initOrderDropdown() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-order-now");

    if (btn) {
      const menu = btn.nextElementSibling;
      // Close others
      document.querySelectorAll(".order-dropdown-menu.open").forEach((m) => {
        if (m !== menu) m.classList.remove("open");
      });
      menu?.classList.toggle("open");
      return;
    }

    if (!e.target.closest(".order-dropdown-menu")) {
      document.querySelectorAll(".order-dropdown-menu.open").forEach((m) =>
        m.classList.remove("open")
      );
    }
  });
}

/* ================================================================
   9. TRIP MODAL
   ================================================================ */
function initTripModal() {
  const cards   = document.querySelectorAll(".trip-card");
  const overlay = document.getElementById("trip-modal-overlay");
  if (!cards.length || !overlay) return;

  const mPhoto      = document.getElementById("trip-modal-photo");
  const mTitle      = document.getElementById("trip-modal-title");
  const mSubtitle   = document.getElementById("trip-modal-subtitle");
  const mPrice      = document.getElementById("trip-modal-price");
  const mFacilities = document.getElementById("trip-modal-facilities");
  const mContact    = document.getElementById("trip-modal-contact");
  const closeBtn    = document.getElementById("trip-modal-close");

  cards.forEach((card) => {
    const photoWrap = card.querySelector(".trip-card-photo");
    if (!photoWrap) return;

    photoWrap.addEventListener("click", () => {
      const img        = card.querySelector(".trip-card-photo img");
      const title      = card.querySelector(".trip-title-overlay h3");
      const subtitle   = card.querySelector(".trip-title-overlay p");
      const price      = card.querySelector(".trip-price-badge");
      const facilities = card.querySelectorAll(".trip-facilities li");
      const contact    = card.querySelector(".trip-order-buttons");

      if (img) { mPhoto.src = img.src; mPhoto.alt = img.alt; }
      mTitle.textContent    = title?.textContent ?? "";
      mSubtitle.textContent = subtitle?.textContent ?? "";
      mPrice.innerHTML      = price?.innerHTML ?? "";
      mFacilities.innerHTML = Array.from(facilities)
        .map((li) => `<li>${li.textContent}</li>`)
        .join("");
      mContact.innerHTML    = contact?.innerHTML ?? "";

      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = () => {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  closeBtn?.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
}

/* ================================================================
   10. SCROLL PROGRESS BAR (thin line at top of page)
   ================================================================ */
function initScrollProgress() {
  const bar = document.createElement("div");
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 3px;
    width: 0%;
    background: linear-gradient(90deg, #e8a820, #c1622d);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : "0%";
  }, { passive: true });
}

/* ================================================================
   11. HERO VIDEO SCALE ANIMATION TRIGGER
   ================================================================ */
function markBodyLoaded() {
  // Small delay so CSS transition on .hero-video scale is visible
  setTimeout(() => document.body.classList.add("loaded"), 100);
}