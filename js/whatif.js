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
