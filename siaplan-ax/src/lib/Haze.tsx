import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * 포스터의 번진 블루 헤이즈를 페이지 전체 뒤에 깐다.
 * - 두 덩어리(좌상·우하)가 스크롤에 따라 천천히 흘러간다.
 * - 장면마다 section[data-haze] 값(0–1)으로 세기를 바꾼다: 선언·지원 장면은 진하게, 정보 장면은 옅게.
 * filter 대신 radial-gradient 만 쓰고 transform/opacity 만 애니메이션해 모바일에서도 가볍다.
 */
export function Haze() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduce) {
        const st = { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 1.2 };
        gsap.fromTo("[data-blob='a']", { xPercent: 0, yPercent: 0, rotate: -8 }, { xPercent: 38, yPercent: 26, rotate: 24, ease: "none", scrollTrigger: st });
        gsap.fromTo("[data-blob='b']", { xPercent: 0, yPercent: 0, rotate: 10 }, { xPercent: -42, yPercent: -30, rotate: -18, ease: "none", scrollTrigger: st });
      }
      // context 스코프(el) 밖의 섹션을 찾아야 하므로 문서 전체에서 직접 찾는다
      document.querySelectorAll<HTMLElement>("section[data-haze]").forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            if (self.isActive) gsap.to(el, { opacity: Number(s.dataset.haze), duration: reduce ? 0 : 0.9, ease: "power2.out", overwrite: true });
          }
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div className="haze" ref={root} aria-hidden="true">
      <span className="haze__blob haze__blob--a" data-blob="a" />
      <span className="haze__blob haze__blob--b" data-blob="b" />
    </div>
  );
}
