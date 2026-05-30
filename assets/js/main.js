/* =========================================================================
   금빛농원 — main.js
   드로어 / 탭 / 아코디언 / 스크롤 reveal / PDP 갤러리 / 수량 / 필터 / 헤더
   외부 의존 없음. Cafe24 이식 시 커머스 동작만 모듈로 교체.
   ========================================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     0. 경량 partial include — <div data-include="partials/header.html">
        GitHub Pages / http server 환경에서 fetch로 주입.
     --------------------------------------------------------------------- */
  function resolveBase() {
    // data-base on <html> lets nested pages point back to root if needed.
    return document.documentElement.getAttribute("data-base") || "";
  }

  async function hydrateIncludes() {
    const base = resolveBase();
    const nodes = Array.from(document.querySelectorAll("[data-include]"));
    await Promise.all(
      nodes.map(async (node) => {
        const url = base + node.getAttribute("data-include");
        try {
          const res = await fetch(url, { cache: "no-cache" });
          if (!res.ok) throw new Error(res.status);
          node.outerHTML = await res.text();
        } catch (err) {
          console.warn("[include] failed:", url, err);
          node.removeAttribute("data-include");
        }
      })
    );
  }

  /* ---------------------------------------------------------------------
     1. Header: scroll state + active nav + drawer
     --------------------------------------------------------------------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (header) {
      const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    // mark current page in GNB + drawer
    const page = document.body.getAttribute("data-page");
    if (page) {
      document.querySelectorAll("[data-nav]").forEach((a) => {
        if (a.getAttribute("data-nav") === page) a.setAttribute("aria-current", "page");
      });
    }

    // drawer open/close
    const openBtn = document.querySelector("[data-drawer-open]");
    const closeEls = document.querySelectorAll("[data-drawer-close]");
    const open = () => document.body.classList.add("drawer-open");
    const close = () => document.body.classList.remove("drawer-open");
    if (openBtn) openBtn.addEventListener("click", open);
    closeEls.forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    // year stamp
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------------------------------------------------------------
     2. Scroll reveal (staggered fade-up)
     --------------------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------------------
     3. Tabs (role=tab + aria-controls)
     --------------------------------------------------------------------- */
  function initTabs() {
    document.querySelectorAll("[data-tabs]").forEach((group) => {
      const tabs = group.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          tabs.forEach((t) => {
            const sel = t === tab;
            t.setAttribute("aria-selected", String(sel));
            const panel = document.getElementById(t.getAttribute("aria-controls"));
            if (panel) panel.hidden = !sel;
          });
        });
      });
    });
  }

  /* ---------------------------------------------------------------------
     4. Accordion (FAQ)
     --------------------------------------------------------------------- */
  function initAccordion() {
    document.querySelectorAll(".acc-item").forEach((item) => {
      const q = item.querySelector(".acc-q");
      const a = item.querySelector(".acc-a");
      if (!q || !a) return;
      q.setAttribute("aria-expanded", "false");
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", String(open));
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      });
    });
  }

  /* ---------------------------------------------------------------------
     5. Quantity steppers
     --------------------------------------------------------------------- */
  function initQty() {
    document.querySelectorAll(".qty").forEach((qty) => {
      const input = qty.querySelector("input");
      const dec = qty.querySelector("[data-qty-dec]");
      const inc = qty.querySelector("[data-qty-inc]");
      const clamp = (v) => Math.max(1, Math.min(99, v || 1));
      if (dec) dec.addEventListener("click", () => (input.value = clamp(+input.value - 1)));
      if (inc) inc.addEventListener("click", () => (input.value = clamp(+input.value + 1)));
      if (input) input.addEventListener("change", () => (input.value = clamp(+input.value)));
    });
  }

  /* ---------------------------------------------------------------------
     6. PDP gallery thumbs
     --------------------------------------------------------------------- */
  function initGallery() {
    const gallery = document.querySelector("[data-gallery]");
    if (!gallery) return;
    const mainImg = gallery.querySelector("[data-gallery-main] img");
    const mainPh = gallery.querySelector("[data-gallery-main] .ph");
    gallery.querySelectorAll(".pdp-thumbs .media").forEach((thumb) => {
      thumb.addEventListener("click", () => {
        gallery.querySelectorAll(".pdp-thumbs .media").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
        const src = thumb.getAttribute("data-src");
        if (mainImg && src) {
          mainImg.hidden = false;
          mainImg.src = src;
        }
        // demo only: thumbnails are placeholders; swap label if present
        if (mainPh && !src) {
          const slot = thumb.getAttribute("data-slot");
          if (slot) mainPh.querySelector(".ph-slot").textContent = slot;
        }
      });
    });
  }

  /* ---------------------------------------------------------------------
     7. Non-functional commerce stubs (시안)
     --------------------------------------------------------------------- */
  function initStubs() {
    document.querySelectorAll("[data-stub]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const msg = el.getAttribute("data-stub") || "시안에서는 동작하지 않는 기능입니다.";
        toast(msg);
      });
    });
    document.querySelectorAll("form[data-stub-form]").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        toast(form.getAttribute("data-stub-form") || "시안 — 실제로 전송되지 않습니다.");
        form.reset();
      });
    });
  }

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      el.setAttribute("role", "status");
      el.style.cssText =
        "position:fixed;left:50%;bottom:32px;transform:translateX(-50%) translateY(20px);" +
        "background:#231B12;color:#FAF6EC;padding:13px 22px;border-radius:2px;font-size:.88rem;" +
        "letter-spacing:.02em;z-index:200;opacity:0;transition:opacity .3s,transform .3s;" +
        "box-shadow:0 20px 50px -20px rgba(0,0,0,.5);max-width:90vw;text-align:center";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateX(-50%) translateY(0)";
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.style.opacity = "0";
      el.style.transform = "translateX(-50%) translateY(20px)";
    }, 2600);
  }
  window.gbToast = toast;

  /* ---------------------------------------------------------------------
     boot
     --------------------------------------------------------------------- */
  async function boot() {
    await hydrateIncludes();
    initHeader();
    initReveal();
    initTabs();
    initAccordion();
    initQty();
    initGallery();
    initStubs();
    // products renderer (defined in products.js, optional per page)
    if (window.GBProducts && typeof window.GBProducts.render === "function") {
      window.GBProducts.render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
