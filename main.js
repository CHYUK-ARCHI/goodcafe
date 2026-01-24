// main.js
document.addEventListener("DOMContentLoaded", () => {
  // === 설정 영역 ===
  const useImageSlider = true; // false로 바꾸면 영상 버전 사용
  const projectImages = [
    "images/project-01.jpg",
    "images/project-02.jpg",
    "images/project-03.jpg",
    "images/project-04.jpg"
  ];
  const slideInterval = 5000; // ms
  const heroMedia = document.getElementById("heroMedia");
  const heroVideo = document.getElementById("heroVideo");
  const heroSection = document.querySelector(".hero");

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let currentIndex = 0;
  let intervalId = null;

  // === 공통 유틸 ===
  function preload(src) {
    const img = new Image();
    img.src = src;
  }

  function isHeroInView() {
    if (!heroSection) return false;
    const rect = heroSection.getBoundingClientRect();
    return rect.bottom >= 0 && rect.top <= window.innerHeight * 0.75;
  }

  function getEffectiveInterval() {
    return prefersReducedMotion && slideInterval < 8000
      ? slideInterval * 2
      : slideInterval;
  }

  function showSlide(index) {
    if (!heroMedia || !projectImages.length) return;

    const url = projectImages[index];
    heroMedia.style.backgroundImage = `url("${url}")`;

    // 줌 인 효과 (모션 선호 설정에 따라)
    heroMedia.classList.remove("zoomed");
    // 강제 리플로우로 트랜지션 재시작
    void heroMedia.offsetWidth;
    if (!prefersReducedMotion) {
      heroMedia.classList.add("zoomed");
    }

    // 다음 이미지 미리 로드
    const nextIndex = (index + 1) % projectImages.length;
    preload(projectImages[nextIndex]);
  }

  function startSlider() {
    if (!useImageSlider || intervalId || !projectImages.length) return;

    // 첫 슬라이드 표시
    showSlide(currentIndex);

    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % projectImages.length;
      showSlide(currentIndex);
    }, getEffectiveInterval());
  }

  function stopSlider() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function resumeSliderIfInView() {
    if (useImageSlider && isHeroInView()) {
      startSlider();
    }
  }

  // === 초기 모드 설정 (이미지 슬라이더 vs 영상) ===
  if (useImageSlider) {
    // 이미지 슬라이더 사용: 영상 숨기기
    if (heroVideo) {
      heroVideo.style.display = "none";
      heroVideo.pause();
    }
  } else {
    // 영상 사용: 배경 이미지 슬라이더 비활성화
    if (heroVideo) {
      heroVideo.style.display = "block";
      if (!prefersReducedMotion) {
        // 자동재생 허용 시만
        heroVideo.play().catch(() => {});
      }
    }
    // 슬라이더는 사용하지 않음
  }

  // === IntersectionObserver로 hero가 보일 때만 슬라이더 동작 ===
  if (useImageSlider && heroSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          startSlider();
        } else {
          stopSlider();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(heroSection);
  } else if (useImageSlider) {
    // IntersectionObserver 미지원 환경: 그냥 슬라이더 시작
    startSlider();
  }

  // === 페이지 visibility 변경 시 처리 (다른 탭 전환 등) ===
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopSlider();
    } else {
      resumeSliderIfInView();
    }
  });

  // === hover/focus 시 일시정지 ===
  if (heroMedia) {
    heroMedia.addEventListener("mouseenter", stopSlider);
    heroMedia.addEventListener("mouseleave", resumeSliderIfInView);

    heroMedia.addEventListener("focusin", stopSlider);
    heroMedia.addEventListener("focusout", resumeSliderIfInView);
  }

  // 초기 1장 세팅 (IntersectionObserver가 늦게 도는 경우 대비)
  if (useImageSlider && projectImages.length) {
    showSlide(currentIndex);
  }
});
