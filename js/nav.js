/**
 * nav.js - 모바일 네비게이션 토글 및 접근성
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 */

(function MobileNav() {
  "use strict";

  function init() {
    const header = document.querySelector("header[role='banner'], header");
    if (!header) return;

    const nav = header.querySelector("nav");
    if (!nav) return;

    // 햄버거 버튼 생성 (없을 경우)
    let toggleBtn = header.querySelector(".nav-toggle");
    if (!toggleBtn) {
      toggleBtn = document.createElement("button");
      toggleBtn.className = "nav-toggle";
      toggleBtn.setAttribute("aria-label", "메뉴 열기");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-controls", "main-nav");
      toggleBtn.innerHTML = `
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
        <span class="nav-toggle__bar"></span>
      `;
      header.insertBefore(toggleBtn, nav);
    }

    nav.id = "main-nav";

    // 토글 이벤트
    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggleBtn.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
      document.body.classList.toggle("nav-open", isOpen);
    });

    // 네비게이션 링크 클릭 시 닫기 (모바일)
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "메뉴 열기");
        document.body.classList.remove("nav-open");
      });
    });

    // ESC 키로 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "메뉴 열기");
        document.body.classList.remove("nav-open");
        toggleBtn.focus();
      }
    });

    // 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (!header.contains(e.target) && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        toggleBtn.setAttribute("aria-label", "메뉴 열기");
        document.body.classList.remove("nav-open");
      }
    });

    // 화면 크기 변경 시 초기화
    window.matchMedia("(min-width: 768px)").addEventListener("change", (e) => {
      if (e.matches) {
        nav.classList.remove("is-open");
        toggleBtn.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
