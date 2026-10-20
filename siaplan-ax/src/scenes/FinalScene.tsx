import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { POSTER_TAGLINE } from "../lib/posterCopy";
import { all, useScrollScene } from "../lib/motion";

export function FinalScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    tl.fromTo(all(el, ".final__a .mask__in"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, 0.3)
      .to(all(el, ".final__a .mask__in"), { yPercent: -110, duration: 0.7, stagger: 0.08, ease: "power3.in" }, 2.1)
      .fromTo(all(el, ".final__b .mask__in"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, 2.8)
      .to(all(el, ".final__b .mask__in"), { yPercent: -110, duration: 0.8, stagger: 0.08, ease: "power3.in" }, 4.8)
      .fromTo(all(el, ".final__brand .mask__in"), { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: 0.15, ease: "power3.out" }, 5.8)
      .fromTo(el.querySelector("[data-spec]"), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, 6.6)
      .fromTo(all(el, "[data-end]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, 7.4)
      .to({}, { duration: 1.2 }, 8.4);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 4.5 }} data-haze="0.65" data-tone="0" data-label="SIAPLAN AI/AX">
      <div className="stage stage--center final">
        <div className="final__lines" data-reveal>
          <h2 className="poster final__a">
            <Mask><span className="ash">AI doesn’t</span></Mask>
            <Mask><span className="ash">design for us.</span></Mask>
          </h2>
          <h2 className="poster final__b">
            <Mask>It changes</Mask>
            <Mask>how we design.</Mask>
          </h2>
        </div>

        <div className="final__end" data-reveal>
          <div className="final__brand">
            <Mask className="poster final__word">SIAPLAN</Mask>
            <Mask className="poster final__word final__ax"><span className="glyph">×</span> AI/AX TF</Mask>
          </div>
          <span className="spectrum final__spectrum" data-spec />
          <p className="tagline final__tag" data-end>
            {POSTER_TAGLINE.map((t) => <span key={t}>{t}<br /></span>)}
          </p>
          <p className="eyebrow final__foot" data-end>Start small. One task. One workflow. One system.</p>
          <div className="final__ctas" data-end>
            <a className="btn btn--fill" href="#apply">지원하기 ↓</a>
            <span className="eyebrow eyebrow--muted">Don’t learn AI. Build with AI.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
