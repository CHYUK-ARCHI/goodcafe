import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SPOTS = ["a", "b", "c"] as const;

/**
 * 포스터의 번진 헤이즈를 페이지 전체 뒤에 깐다.
 * - 움직임: 덩어리들이 스크롤과 무관하게 아주 느리게 흐른다 (CSS keyframes, 43·57·49초 주기).
 * - 색: 같은 자리에 블루와 보색(살구)을 겹쳐 두고, 장면의 section[data-tone](0=블루, 1=살구)에 따라 교차 페이드한다.
 *   페이지 중반(플랫폼·툴·목표)에서 살구가 가장 진하고, Final·Apply 에서 다시 블루로 돌아온다.
 * - 세기: section[data-haze](0–1)로 전체 진하기를 정한다.
 * filter 없이 radial-gradient + transform/opacity 만 쓰므로 모바일에서도 가볍다.
 */
export function Haze() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blue = el.querySelectorAll(".haze__blob--blue");
    const warm = el.querySelectorAll(".haze__blob--warm");
    const fade = reduce ? 0 : 1.2;

    const apply = (haze: number, tone: number) => {
      gsap.to(el, { opacity: haze, duration: fade, ease: "power2.out", overwrite: true });
      gsap.to(blue, { opacity: 1 - tone, duration: fade, ease: "power2.inOut", overwrite: true });
      gsap.to(warm, { opacity: tone, duration: fade, ease: "power2.inOut", overwrite: true });
    };

    const triggers = Array.from(document.querySelectorAll<HTMLElement>("section[data-haze]")).map((s) =>
      ScrollTrigger.create({
        trigger: s,
        start: "top 55%",
        end: "bottom 45%",
        onToggle: (self) => {
          if (self.isActive) apply(Number(s.dataset.haze), Number(s.dataset.tone || 0));
        }
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <div className="haze" ref={root} aria-hidden="true">
      {SPOTS.map((k) => (
        <span key={k} className={`haze__drift haze__drift--${k}`}>
          <span className="haze__blob haze__blob--blue" />
          <span className="haze__blob haze__blob--warm" />
        </span>
      ))}
    </div>
  );
}
