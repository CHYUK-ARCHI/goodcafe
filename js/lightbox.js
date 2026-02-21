/**
 * lightbox.js - 이미지 라이트박스
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 *
 * 사용법:
 *   <a href="images/large.jpg" data-lightbox>
 *     <img src="images/thumb.jpg" alt="프로젝트 설명">
 *   </a>
 */

(function Lightbox() {
  "use strict";

  let overlay, imgEl, captionEl, closeBtn, prevBtn, nextBtn;
  let items = [];
  let currentIndex = 0;

  function init() {
    items = Array.from(document.querySelectorAll("[data-lightbox]"));
    if (!items.length) return;

    buildDOM();
    bindEvents();
    items.forEach((item, i) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        open(i);
      });
    });
  }

  function buildDOM() {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "이미지 뷰어");
    overlay.setAttribute("hidden", "");

    overlay.innerHTML = `
      <button class="lightbox-close" aria-label="닫기">&times;</button>
      <button class="lightbox-prev" aria-label="이전 이미지">&#8249;</button>
      <button class="lightbox-next" aria-label="다음 이미지">&#8250;</button>
      <figure class="lightbox-figure">
        <img class="lightbox-img" src="" alt="">
        <figcaption class="lightbox-caption"></figcaption>
      </figure>
    `;

    document.body.appendChild(overlay);

    imgEl     = overlay.querySelector(".lightbox-img");
    captionEl = overlay.querySelector(".lightbox-caption");
    closeBtn  = overlay.querySelector(".lightbox-close");
    prevBtn   = overlay.querySelector(".lightbox-prev");
    nextBtn   = overlay.querySelector(".lightbox-next");
  }

  function bindEvents() {
    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => navigate(-1));
    nextBtn.addEventListener("click", () => navigate(1));

    // 오버레이 배경 클릭 닫기
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    // 키보드 제어
    document.addEventListener("keydown", (e) => {
      if (overlay.hasAttribute("hidden")) return;
      if (e.key === "Escape")      close();
      if (e.key === "ArrowLeft")   navigate(-1);
      if (e.key === "ArrowRight")  navigate(1);
    });
  }

  function open(index) {
    currentIndex = index;
    loadImage(index);
    overlay.removeAttribute("hidden");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
    updateNav();
  }

  function close() {
    overlay.setAttribute("hidden", "");
    document.body.style.overflow = "";
    items[currentIndex]?.focus();
  }

  function navigate(dir) {
    currentIndex = (currentIndex + dir + items.length) % items.length;
    loadImage(currentIndex);
    updateNav();
  }

  function loadImage(index) {
    const item = items[index];
    const src = item.href || item.dataset.src || item.querySelector("img")?.src || "";
    const alt = item.dataset.caption || item.querySelector("img")?.alt || "";

    imgEl.style.opacity = "0";
    imgEl.src = src;
    imgEl.alt = alt;
    captionEl.textContent = alt;

    imgEl.onload = () => {
      imgEl.style.transition = "opacity 0.3s ease";
      imgEl.style.opacity = "1";
    };
  }

  function updateNav() {
    prevBtn.style.display = items.length <= 1 ? "none" : "";
    nextBtn.style.display = items.length <= 1 ? "none" : "";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
