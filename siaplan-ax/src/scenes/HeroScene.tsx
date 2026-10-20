import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { POSTER_LINES } from "../lib/posterCopy";
import { all, useScrollScene } from "../lib/motion";

export function HeroScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const q = (s: string) => el.querySelector(s)!;

    // 첫 화면은 포스터 구도 그대로. 스크롤하면 × 가 + (제도용 십자선)로 돌며 화면 중심으로 확장된다.
    tl.to(q("[data-mark]"), { rotate: 45, x: "-14vw", duration: 2.4, ease: "power2.inOut" }, 0.2)
      .to(all(el, ".hero__arm"), { scaleX: 7, scaleY: 0.06, duration: 2.4, ease: "power2.inOut" }, 0.2)
      .to(all(el, "[data-meta]"), { yPercent: -60, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power2.in" }, 0.2)
      .fromTo(q("[data-ax]"), { scale: 0, rotate: -45 }, { scale: 1, rotate: -45, duration: 0.9, ease: "back.out(1.8)" }, 2.4)
      .to(all(el, ".hero__head .mask__in"), { yPercent: -110, duration: 1, stagger: 0.06, ease: "power3.in" }, 3.4)
      .to(q("[data-spec]"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.8, ease: "power2.in" }, 3.4)
      .to(all(el, ".hero__arm"), { scaleX: 0, duration: 1, ease: "power3.in" }, 4.2)
      .to(q("[data-ax]"), { scale: 0, duration: 0.6, ease: "power2.in" }, 4.4)
      // 선언문
      .fromTo(all(el, ".manifest--1 .mask__in"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, 5.2)
      .to(all(el, ".manifest--1 .mask__in"), { yPercent: -110, duration: 0.8, stagger: 0.12, ease: "power3.in" }, 7.1)
      .fromTo(all(el, ".manifest--2 .mask__in"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, 7.9)
      .to({}, { duration: 1.2 }, 9.1);
  });

  return (
    <section ref={ref} id="top" className="scene" style={{ ["--len" as string]: 4 }} data-haze="0.65" data-tone="0" data-label="Declaration">
      <div className="stage hero">
        <div className="hero__head" data-reveal>
          <Mask><span className="eyebrow">_SIAPLAN AI / AX TEAM</span></Mask>
          <h1 className="poster hero__title">
            <Mask>Architecture</Mask>
            <Mask><span className="hero__times glyph">×</span> Intelligence</Mask>
          </h1>
          <span className="spectrum hero__spectrum" data-spec />
          <Mask>
            <ul className="underscore hero__lines">
              {POSTER_LINES.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </Mask>
        </div>

        <div className="hero__mark" data-mark aria-hidden="true">
          <span className="hero__armwrap hero__armwrap--1"><span className="hero__arm" /></span>
          <span className="hero__armwrap hero__armwrap--2"><span className="hero__arm" /></span>
          <span className="chip chip--ink hero__ax" data-ax>AI / AX</span>
        </div>

        <div className="hero__meta" data-reveal>
          <p className="poster-sm hero__stack" data-meta>SIAPLAN<br />AI/AX TEAM TF<br />ONBOARDING</p>
          <p className="eyebrow eyebrow--muted hero__cue" data-meta>Scroll ↓</p>
        </div>

        <div className="hero__manifest">
          <p className="poster manifest manifest--1" data-reveal>
            <Mask><span className="ash">We are not adding AI</span></Mask>
            <Mask><span className="ash">to architecture.</span></Mask>
          </p>
          <p className="poster manifest manifest--2" data-reveal>
            <Mask>We are redesigning</Mask>
            <Mask>how architecture works.</Mask>
          </p>
        </div>
      </div>
    </section>
  );
}
