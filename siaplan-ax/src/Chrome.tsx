import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** 고정 내비: 워드마크 · 현재 장면 · 전체 진행 */
export function Chrome() {
  const bar = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState({ i: 0, label: "Declaration" });
  const [total, setTotal] = useState(9);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(bar.current, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true }
      });
      const sections = gsap.utils.toArray<HTMLElement>("section[data-label]");
      setTotal(sections.length);
      sections.forEach((s, i) => {
        ScrollTrigger.create({
          trigger: s,
          start: "top 50%",
          end: "bottom 50%",
          onToggle: (self) => self.isActive && setScene({ i, label: s.dataset.label || "" })
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true"><div className="progress__bar" ref={bar} /></div>
      <header className="nav">
        <a className="nav__brand" href="#top" aria-label="SIAPLAN AI/AX 처음으로">
          <span className="glyph">×</span>
          <span>SIAPLAN</span>
          <span>AI / AX</span>
        </a>
        <div className="nav__right">
          <span className="eyebrow nav__label">{scene.label}</span>
          <span className="eyebrow nav__count">{String(scene.i).padStart(2, "0")} / {String(total - 1).padStart(2, "0")}</span>
        </div>
      </header>
    </>
  );
}
