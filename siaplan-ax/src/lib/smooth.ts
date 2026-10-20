import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION } from "./motion";
import { nextSnap } from "./stepper";

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

let active: Lenis | null = null;

/** 장면 바 등에서 쓰는 공용 이동. 데스크톱(Lenis)은 부드럽게, 그 외는 브라우저 기본 smooth. */
export function scrollToY(y: number, duration = 1.4) {
  if (active) {
    active.scrollTo(y, { duration, easing: easeOutQuart, lock: true, force: true });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }
}

/**
 * 데스크톱 + 모션 허용일 때:
 * - Lenis 로 부드러운 스크롤을 하되, 휠은 직접 받아 한 번에 한 단계(step)씩 이동한다.
 * - 트랙패드 관성(같은 제스처의 꼬리 이벤트)은 무시해 한 번 쓸면 한 단계만 넘어간다.
 * - ↓ / PageDown / Space 다음, ↑ / PageUp / Shift+Space 이전, Home / End 처음·끝.
 * - 페이지 내 링크(#apply, #top)는 부드럽게 이동한다.
 * 모바일·reduced-motion 은 기본 스크롤 그대로 둔다.
 */
export function initSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  // 창 크기가 바뀌어 데스크톱 ↔ 모바일 레이아웃이 바뀌면 스텝 스크롤도 함께 켜고 끈다.
  // (모바일 레이아웃에는 멈춤 지점이 없어서, 켜 둔 채로 두면 한 번 스크롤에 페이지 끝까지 내려간다)
  const mq = window.matchMedia(DESKTOP_MOTION);
  let stop: (() => void) | null = null;
  const apply = () => {
    if (mq.matches && !stop) stop = start();
    else if (!mq.matches && stop) {
      stop();
      stop = null;
    }
  };
  apply();
  mq.addEventListener("change", apply);
  return () => {
    mq.removeEventListener("change", apply);
    if (stop) stop();
    stop = null;
  };
}

function start(): () => void {
  const lenis = new Lenis({ lerp: 0.1, smoothWheel: false });
  active = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  let busy = false;
  let lastWheelAt = 0;
  let lastMag = 0;

  const goTo = (target: number, duration?: number) => {
    const dist = Math.abs(target - window.scrollY);
    busy = true;
    lenis.scrollTo(target, {
      duration: duration ?? Math.min(1.5, Math.max(0.8, 0.75 + dist / 2400)),
      easing: easeOutQuart,
      lock: true,
      force: true,
      onComplete: () => {
        busy = false;
        lastWheelAt = performance.now();
      }
    });
  };
  const step = (dir: 1 | -1) => {
    if (busy) return;
    const target = nextSnap(window.scrollY, dir);
    if (target !== undefined) goTo(target);
  };

  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return; // 핀치 줌은 그대로
    e.preventDefault();
    const now = performance.now();
    const mag = Math.abs(e.deltaY);
    const gap = now - lastWheelAt;
    lastWheelAt = now;
    if (busy) {
      lastMag = mag;
      return;
    }
    // 관성 꼬리: 직전 이벤트와 간격이 짧고 크기가 줄어드는 중이면 같은 제스처로 본다
    const inertiaTail = gap < 220 && mag <= lastMag * 1.15;
    lastMag = mag;
    if (inertiaTail || mag < 4) return;
    step(e.deltaY > 0 ? 1 : -1);
  };

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
    if (e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey)) {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey)) {
      e.preventDefault();
      step(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0, 1.6);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(document.documentElement.scrollHeight - window.innerHeight, 1.6);
    }
  };

  // 넓은 화면의 터치 기기(태블릿 가로): 스와이프 한 번 = 한 단계
  let touchY = 0;
  const onTouchStart = (e: TouchEvent) => {
    touchY = e.touches[0].clientY;
  };
  const onTouchMove = (e: TouchEvent) => e.preventDefault();
  const onTouchEnd = (e: TouchEvent) => {
    const dy = touchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 40) step(dy > 0 ? 1 : -1);
  };

  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href")!.slice(1);
    const el = id ? document.getElementById(id) : null;
    e.preventDefault();
    goTo(el ? el.getBoundingClientRect().top + window.scrollY : 0, 1.6);
  };

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKey);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: false });
  window.addEventListener("touchend", onTouchEnd);
  document.addEventListener("click", onClick);

  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("touchstart", onTouchStart);
    window.removeEventListener("touchmove", onTouchMove);
    window.removeEventListener("touchend", onTouchEnd);
    document.removeEventListener("click", onClick);
    gsap.ticker.remove(tick);
    lenis.destroy();
    active = null;
  };
}
