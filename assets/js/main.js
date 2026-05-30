const menuButton = document.querySelector("[data-menu-button]");

if (menuButton) {
  menuButton.addEventListener("click", () => {
    document.body.classList.toggle("drawer-open");
    const isOpen = document.body.classList.contains("drawer-open");
    menuButton.setAttribute("aria-label", isOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기");
  });
}

document.querySelectorAll("[data-drawer] a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("drawer-open"));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  observer.observe(element);
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    const group = chip.closest(".filter-row, .community-tabs");
    group?.querySelectorAll(".chip").forEach((item) => item.classList.remove("is-active"));
    chip.classList.add("is-active");
  });
});

const mainImage = document.querySelector("[data-main-image]");
document.querySelectorAll("[data-thumb]").forEach((thumb) => {
  thumb.addEventListener("click", () => {
    if (!mainImage) return;
    mainImage.src = thumb.dataset.thumb || mainImage.src;
  });
});

document.querySelectorAll("[data-tab]").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll("[data-tab]").forEach((item) => item.classList.remove("is-active"));
    tab.classList.add("is-active");
    const content = document.querySelector("[data-tab-content]");
    if (content) {
      content.textContent = tab.dataset.tab || "";
    }
  });
});
