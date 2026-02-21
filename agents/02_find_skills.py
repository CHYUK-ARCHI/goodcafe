#!/usr/bin/env python3
"""
Agent 02: Skills Finder & Creator Agent
=========================================
Re-Archive 레포지토리에서 누락된 스킬/기능을 탐지하고 자동으로 생성합니다:

탐지 & 생성 대상:
  1. whatif.js       - What-if 페이지 필터 기능
  2. js/contact.js   - 연락처 폼 유효성 검사
  3. js/nav.js       - 모바일 네비게이션 토글
  4. js/lightbox.js  - 이미지 라이트박스
  5. css/utils.css   - 유틸리티 CSS 클래스

Usage:
    python3 agents/02_find_skills.py
    python3 agents/02_find_skills.py --dry-run   # 실제 파일 생성 없이 탐지만
    python3 agents/02_find_skills.py --skill whatif contact
"""

import os
import re
import sys
import argparse
from pathlib import Path
from datetime import datetime


ROOT = Path(__file__).parent.parent
REPORTS_DIR = ROOT / "reports"


# ─── 스킬 정의 ────────────────────────────────────────────────────────────────

SKILLS = {
    "whatif": {
        "name": "What-if 필터 기능",
        "detect_in": ["pages/what-if.html"],
        "detect_pattern": r"whatif\.js|filter.*category|data-category",
        "output_path": "js/whatif.js",
        "description": "카테고리 필터 버튼으로 What-if 프로젝트 카드 필터링",
    },
    "contact": {
        "name": "연락처 폼 유효성 검사",
        "detect_in": ["index.html", "pages/contact.html"],
        "detect_pattern": r"contact.*form|form.*contact|#contact",
        "output_path": "js/contact.js",
        "description": "이메일/이름 폼 클라이언트 사이드 유효성 검사",
    },
    "nav": {
        "name": "모바일 네비게이션 토글",
        "detect_in": ["partials/header.html"],
        "detect_pattern": r"hamburger|menu-toggle|nav-toggle|mobile.*nav",
        "output_path": "js/nav.js",
        "description": "모바일 햄버거 메뉴 토글 및 접근성",
    },
    "lightbox": {
        "name": "이미지 라이트박스",
        "detect_in": ["pages/projects.html", "index.html"],
        "detect_pattern": r"lightbox|modal.*image|gallery.*modal",
        "output_path": "js/lightbox.js",
        "description": "프로젝트 이미지 클릭 시 전체화면 라이트박스",
    },
    "utils_css": {
        "name": "유틸리티 CSS",
        "detect_in": ["styles/styles.css"],
        "detect_pattern": r"\.sr-only|\.visually-hidden|\.container|\.flex",
        "output_path": "css/utils.css",
        "description": "재사용 가능한 유틸리티 CSS 클래스 모음",
    },
}


# ─── 스킬 코드 템플릿 ─────────────────────────────────────────────────────────

def generate_whatif_js() -> str:
    return '''\
/**
 * whatif.js - What-if 프로젝트 필터 기능
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 *
 * 기능:
 *   - 카테고리 버튼 클릭으로 카드 필터링
 *   - URL hash로 필터 상태 유지 (뒤로가기 지원)
 *   - 접근성: ARIA live region으로 필터 결과 알림
 *   - 애니메이션: 카드 fade-in/out
 */

(function WhatIfFilter() {
  "use strict";

  // ─── 설정 ─────────────────────────────────────────────────────────────
  const ANIMATION_DURATION = 300; // ms
  const FILTER_ATTR = "data-category";
  const ACTIVE_CLASS = "is-active";
  const HIDDEN_CLASS = "is-hidden";

  // ─── DOM 요소 ─────────────────────────────────────────────────────────
  let filterButtons = [];
  let cards = [];
  let liveRegion = null;
  let currentFilter = "all";

  // ─── 초기화 ──────────────────────────────────────────────────────────
  function init() {
    filterButtons = Array.from(document.querySelectorAll("[data-filter]"));
    cards = Array.from(document.querySelectorAll(".whatif-card, [data-category]"));

    if (!filterButtons.length || !cards.length) {
      return; // What-if 페이지가 아닌 경우 종료
    }

    // ARIA live region 생성 (스크린리더용)
    liveRegion = document.createElement("div");
    liveRegion.setAttribute("aria-live", "polite");
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);

    // 이벤트 바인딩
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", onFilterClick);
      btn.addEventListener("keydown", onFilterKeydown);
    });

    // URL hash로 초기 필터 복원
    const hashFilter = window.location.hash.replace("#", "") || "all";
    applyFilter(hashFilter, false);

    // hash 변경 감지
    window.addEventListener("hashchange", () => {
      const filter = window.location.hash.replace("#", "") || "all";
      applyFilter(filter, false);
    });
  }

  // ─── 필터 클릭 핸들러 ─────────────────────────────────────────────────
  function onFilterClick(e) {
    e.preventDefault();
    const filter = e.currentTarget.dataset.filter || "all";
    applyFilter(filter, true);
    // URL hash 업데이트 (뒤로가기 지원)
    history.pushState(null, "", filter === "all" ? "#" : `#${filter}`);
  }

  function onFilterKeydown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFilterClick(e);
    }
  }

  // ─── 필터 적용 ────────────────────────────────────────────────────────
  function applyFilter(filter, animate) {
    currentFilter = filter;

    // 버튼 활성화 상태 업데이트
    filterButtons.forEach((btn) => {
      const isActive = btn.dataset.filter === filter || (filter === "all" && btn.dataset.filter === "all");
      btn.classList.toggle(ACTIVE_CLASS, isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    // 카드 표시/숨김
    let visibleCount = 0;
    cards.forEach((card) => {
      const category = card.dataset.category || "";
      const show = filter === "all" || category === filter;

      if (animate) {
        animateCard(card, show);
      } else {
        card.classList.toggle(HIDDEN_CLASS, !show);
        card.setAttribute("aria-hidden", show ? "false" : "true");
      }

      if (show) visibleCount++;
    });

    // 스크린리더 알림
    const filterLabel = filterButtons.find((b) => b.dataset.filter === filter)?.textContent || filter;
    liveRegion.textContent = `"${filterLabel}" 카테고리: ${visibleCount}개 프로젝트 표시 중`;
  }

  // ─── 카드 애니메이션 ──────────────────────────────────────────────────
  function animateCard(card, show) {
    if (show) {
      card.classList.remove(HIDDEN_CLASS);
      card.setAttribute("aria-hidden", "false");
      card.style.opacity = "0";
      card.style.transform = "translateY(8px)";
      // 브라우저 페인트 후 트랜지션 시작
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          card.style.transition = `opacity ${ANIMATION_DURATION}ms ease, transform ${ANIMATION_DURATION}ms ease`;
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        });
      });
    } else {
      card.style.transition = `opacity ${ANIMATION_DURATION}ms ease`;
      card.style.opacity = "0";
      setTimeout(() => {
        card.classList.add(HIDDEN_CLASS);
        card.setAttribute("aria-hidden", "true");
        card.style.transition = "";
        card.style.opacity = "";
        card.style.transform = "";
      }, ANIMATION_DURATION);
    }
  }

  // ─── 실행 ────────────────────────────────────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
'''


def generate_contact_js() -> str:
    return '''\
/**
 * contact.js - 연락처 폼 유효성 검사 및 제출 처리
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 */

(function ContactForm() {
  "use strict";

  const FORM_ID = "contact-form";
  const FIELDS = {
    name:    { required: true,  minLength: 2,   label: "이름" },
    email:   { required: true,  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "이메일" },
    message: { required: true,  minLength: 10,  label: "메시지" },
  };

  function init() {
    const form = document.getElementById(FORM_ID);
    if (!form) return;

    form.addEventListener("submit", onSubmit);

    // 실시간 유효성 검사 (blur 이벤트)
    Object.keys(FIELDS).forEach((name) => {
      const input = form.elements[name];
      if (input) input.addEventListener("blur", () => validateField(name, input.value));
    });
  }

  function validateField(name, value) {
    const rule = FIELDS[name];
    if (!rule) return true;

    let error = null;
    const trimmed = value.trim();

    if (rule.required && !trimmed) {
      error = `${rule.label}을(를) 입력해 주세요.`;
    } else if (rule.minLength && trimmed.length < rule.minLength) {
      error = `${rule.label}은(는) ${rule.minLength}자 이상이어야 합니다.`;
    } else if (rule.pattern && !rule.pattern.test(trimmed)) {
      error = `올바른 ${rule.label} 형식이 아닙니다.`;
    }

    showFieldError(name, error);
    return !error;
  }

  function showFieldError(name, message) {
    const errorEl = document.getElementById(`${name}-error`);
    if (!errorEl) return;

    if (message) {
      errorEl.textContent = message;
      errorEl.removeAttribute("hidden");
    } else {
      errorEl.textContent = "";
      errorEl.setAttribute("hidden", "");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    Object.keys(FIELDS).forEach((name) => {
      const input = form.elements[name];
      if (input && !validateField(name, input.value)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // 제출 시뮬레이션 (실제 백엔드 연동 필요)
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "전송 중...";
    }

    // Formspree / Netlify Forms 등 연동 지점
    // fetch("https://formspree.io/f/YOUR_ID", { method: "POST", body: new FormData(form) })
    setTimeout(() => {
      form.reset();
      showSuccess();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "보내기";
      }
    }, 1000);
  }

  function showSuccess() {
    const msg = document.createElement("p");
    msg.className = "form-success";
    msg.textContent = "메시지가 전송되었습니다. 감사합니다!";
    msg.setAttribute("role", "alert");
    document.getElementById(FORM_ID)?.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
'''


def generate_nav_js() -> str:
    return '''\
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
'''


def generate_lightbox_js() -> str:
    return '''\
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
'''


def generate_utils_css() -> str:
    return '''\
/**
 * utils.css - 유틸리티 CSS 클래스
 * Re-Archive | agents/02_find_skills.py 에 의해 생성됨
 *
 * 포함 내용:
 *   - 스크린리더 전용 클래스
 *   - 레이아웃 유틸리티
 *   - 타이포그래피 유틸리티
 *   - 색상/배경 유틸리티
 *   - 간격 유틸리티
 *   - 라이트박스 스타일
 *   - 모바일 네비게이션 스타일
 */

/* ── 접근성 ──────────────────────────────────────────────────────────────── */

.sr-only,
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* ── 레이아웃 ─────────────────────────────────────────────────────────────── */

.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: clamp(1rem, 5vw, 3rem);
}

.flex        { display: flex; }
.flex-col    { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.justify-center  { justify-content: center; }
.gap-sm      { gap: 0.5rem; }
.gap-md      { gap: 1rem; }
.gap-lg      { gap: 2rem; }

.grid        { display: grid; }
.grid-2      { grid-template-columns: repeat(2, 1fr); }
.grid-3      { grid-template-columns: repeat(3, 1fr); }
.grid-auto   { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); }

/* ── 타이포그래피 ─────────────────────────────────────────────────────────── */

.text-sm     { font-size: clamp(0.75rem, 1.5vw, 0.875rem); }
.text-base   { font-size: clamp(0.875rem, 2vw, 1rem); }
.text-lg     { font-size: clamp(1rem, 2.5vw, 1.25rem); }
.text-xl     { font-size: clamp(1.25rem, 3vw, 1.5rem); }
.text-2xl    { font-size: clamp(1.5rem, 4vw, 2rem); }

.font-light  { font-weight: 300; }
.font-normal { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-bold   { font-weight: 700; }

.uppercase   { text-transform: uppercase; }
.tracking-wide { letter-spacing: 0.05em; }
.tracking-wider { letter-spacing: 0.1em; }

/* ── 간격 ────────────────────────────────────────────────────────────────── */

.mt-sm  { margin-top: 0.5rem; }
.mt-md  { margin-top: 1rem; }
.mt-lg  { margin-top: 2rem; }
.mt-xl  { margin-top: 4rem; }
.mb-sm  { margin-bottom: 0.5rem; }
.mb-md  { margin-bottom: 1rem; }
.mb-lg  { margin-bottom: 2rem; }

.pt-sm  { padding-top: 0.5rem; }
.pt-md  { padding-top: 1rem; }
.pt-lg  { padding-top: 2rem; }
.pb-sm  { padding-bottom: 0.5rem; }
.pb-md  { padding-bottom: 1rem; }
.pb-lg  { padding-bottom: 2rem; }

/* ── 색상 ────────────────────────────────────────────────────────────────── */

:root {
  --color-bg:       #ffffff;
  --color-fg:       #111111;
  --color-muted:    #888888;
  --color-accent:   #111111;
  --color-border:   #e5e5e5;
}

.text-muted  { color: var(--color-muted); }
.text-accent { color: var(--color-accent); }
.bg-white    { background-color: var(--color-bg); }
.bg-black    { background-color: var(--color-fg); }

/* ── 표시/숨김 ───────────────────────────────────────────────────────────── */

.is-hidden   { display: none !important; }
.is-visible  { display: block !important; }

/* ── 라이트박스 ──────────────────────────────────────────────────────────── */

.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-overlay[hidden] { display: none; }

.lightbox-figure {
  max-width: 90vw;
  max-height: 90vh;
  text-align: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  display: block;
}

.lightbox-caption {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin-top: 0.75rem;
}

.lightbox-close,
.lightbox-prev,
.lightbox-next {
  position: fixed;
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  padding: 0.5rem;
  line-height: 1;
}

.lightbox-close:hover,
.lightbox-prev:hover,
.lightbox-next:hover {
  opacity: 1;
}

.lightbox-close { top: 1rem; right: 1.5rem; font-size: 2.5rem; }
.lightbox-prev  { left: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 3rem; }
.lightbox-next  { right: 1.5rem; top: 50%; transform: translateY(-50%); font-size: 3rem; }

/* ── 모바일 네비게이션 ───────────────────────────────────────────────────── */

.nav-toggle {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  gap: 5px;
}

.nav-toggle__bar {
  display: block;
  width: 22px;
  height: 2px;
  background-color: currentColor;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

@media (max-width: 768px) {
  .nav-toggle {
    display: flex;
  }

  #main-nav {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.98);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    z-index: 100;
  }

  #main-nav.is-open {
    display: flex;
  }

  #main-nav a {
    font-size: clamp(1.25rem, 5vw, 2rem);
  }
}

/* ── 폼 유효성 검사 ──────────────────────────────────────────────────────── */

.form-error {
  color: #cc0000;
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

.form-success {
  color: #006600;
  background: #f0fff0;
  border: 1px solid #006600;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

/* ── What-if 필터 (is-active, is-hidden 보완) ────────────────────────────── */

[data-filter].is-active {
  background-color: var(--color-fg);
  color: var(--color-bg);
}

.whatif-card.is-hidden {
  display: none;
}

/* ── 반응형 그리드 ───────────────────────────────────────────────────────── */

@media (max-width: 768px) {
  .grid-2, .grid-3 {
    grid-template-columns: 1fr;
  }
}
'''


# ─── 탐지 로직 ────────────────────────────────────────────────────────────────

def detect_needed_skills(root: Path) -> list[str]:
    """레포지토리를 스캔하여 필요한 스킬 목록 반환."""
    needed = []

    for skill_key, skill_info in SKILLS.items():
        output = root / skill_info["output_path"]

        # 이미 파일이 존재하면 건너뜀
        if output.exists():
            continue

        # 참조하는 HTML에서 패턴 검색
        pattern = re.compile(skill_info["detect_pattern"], re.IGNORECASE)
        referenced = False

        for detect_path in skill_info["detect_in"]:
            filepath = root / detect_path
            if filepath.exists():
                content = filepath.read_text(encoding="utf-8", errors="ignore")
                if pattern.search(content):
                    referenced = True
                    break

        # whatif.js는 what-if.html이 존재하는 한 항상 필요
        if skill_key == "whatif" and (root / "pages/what-if.html").exists():
            needed.append(skill_key)
        elif referenced:
            needed.append(skill_key)
        # nav, lightbox, utils_css는 프로젝트 규모상 항상 권장
        elif skill_key in ("nav", "lightbox", "utils_css"):
            needed.append(skill_key)

    return needed


# ─── 스킬 생성 ────────────────────────────────────────────────────────────────

GENERATORS = {
    "whatif":    generate_whatif_js,
    "contact":   generate_contact_js,
    "nav":       generate_nav_js,
    "lightbox":  generate_lightbox_js,
    "utils_css": generate_utils_css,
}


def create_skill(skill_key: str, root: Path, dry_run: bool = False) -> dict:
    """단일 스킬 파일 생성."""
    skill = SKILLS[skill_key]
    output_path = root / skill["output_path"]
    generator = GENERATORS.get(skill_key)

    if not generator:
        return {"key": skill_key, "status": "error", "message": "Generator not found"}

    content = generator()

    if dry_run:
        return {"key": skill_key, "status": "dry_run", "path": str(output_path), "lines": len(content.splitlines())}

    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(content, encoding="utf-8")

    return {
        "key": skill_key,
        "status": "created",
        "path": str(output_path.relative_to(root)),
        "lines": len(content.splitlines()),
    }


# ─── 리포트 생성 ──────────────────────────────────────────────────────────────

def save_report(results: list[dict], root: Path):
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / "skills.md"
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    lines = [
        "# 스킬 발굴 & 생성 리포트",
        "",
        f"> 생성일시: {now}  ",
        f"> 분석 에이전트: `agents/02_find_skills.py`",
        "",
        "---",
        "",
        "## 생성된 스킬",
        "",
        "| 스킬 | 파일 경로 | 상태 | 라인 수 |",
        "|------|----------|------|--------|",
    ]

    for r in results:
        status_icon = {"created": "✅", "dry_run": "👁", "skip": "⏭", "error": "❌"}.get(r["status"], "?")
        lines.append(f"| {SKILLS.get(r['key'], {}).get('name', r['key'])} | `{r.get('path', '-')}` | {status_icon} {r['status']} | {r.get('lines', '-')} |")

    lines += [
        "",
        "---",
        "",
        "## 스킬별 설명",
        "",
    ]
    for r in results:
        if r["status"] in ("created", "dry_run"):
            info = SKILLS.get(r["key"], {})
            lines += [
                f"### {info.get('name', r['key'])}",
                f"",
                f"- **파일**: `{r.get('path', '-')}`",
                f"- **설명**: {info.get('description', '-')}",
                f"- **라인**: {r.get('lines', '-')}줄",
                f"",
            ]

    lines += [
        "---",
        "",
        "## HTML 연동 방법",
        "",
        "생성된 스킬을 HTML에 추가하려면:",
        "",
        "```html",
        "<!-- pages/what-if.html에 추가 -->",
        '<script src="../js/whatif.js"></script>',
        "",
        "<!-- partials/header.html에 추가 -->",
        '<script src="../js/nav.js"></script>',
        "",
        "<!-- 전역 CSS (index.html <head>에 추가) -->",
        '<link rel="stylesheet" href="css/utils.css">',
        "```",
        "",
        "_이 리포트는 `agents/02_find_skills.py`에 의해 자동 생성되었습니다._",
    ]

    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Re-Archive 스킬 발굴 & 생성 에이전트")
    parser.add_argument("--dry-run", "-n", action="store_true", help="파일 생성 없이 탐지만")
    parser.add_argument("--skill", nargs="+", choices=list(SKILLS.keys()), help="생성할 스킬 지정")
    args = parser.parse_args()

    print("\n🔧 Skills Finder & Creator Agent")
    print("=" * 50)

    # 필요한 스킬 탐지
    if args.skill:
        needed = args.skill
        print(f"\n[지정 모드] {', '.join(needed)}")
    else:
        print("\n[1/2] 필요한 스킬 탐지 중...")
        needed = detect_needed_skills(ROOT)
        print(f"      → {len(needed)}개 스킬 필요: {', '.join(needed) if needed else '없음'}")

    if not needed:
        print("\n✅ 모든 스킬이 이미 존재합니다.")
        return

    # 스킬 생성
    action = "탐지" if args.dry_run else "생성"
    print(f"\n[2/2] 스킬 {action} 중...")
    results = []
    for key in needed:
        result = create_skill(key, ROOT, dry_run=args.dry_run)
        results.append(result)
        icon = "👁" if args.dry_run else "✓"
        print(f"  {icon} [{result['status']}] {SKILLS[key]['name']}: {result.get('path', '-')} ({result.get('lines', 0)}줄)")

    # 리포트 저장
    report_path = save_report(results, ROOT)
    print(f"\n📄 리포트 저장: {report_path.relative_to(ROOT)}")

    print(f"\n{'=' * 50}")
    print(f"✅ 완료: {len(results)}개 스킬 {'탐지됨' if args.dry_run else '생성됨'}")
    print()


if __name__ == "__main__":
    main()
