import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION } from "./motion";

/** Lenis 부드러운 스크롤을 GSAP ticker·ScrollTrigger와 동기화한다. 데스크톱+모션 허용일 때만 켠다. */
export function initSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  if (!window.matchMedia(DESKTOP_MOTION).matches) return () => {};

  const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
}
