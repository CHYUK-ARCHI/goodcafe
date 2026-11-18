import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { CHAPTERS } from "../lib/chapters";
import { POSTER_LINES } from "../lib/posterCopy";
import { all, steps, useScrollScene } from "../lib/motion";

/** 표지. 텍스트만 — 제목 · 한 줄 요약 · 포스터 문구. */
export function HeroScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    // 첫 화면은 완성된 표지. 스크롤하면 제목이 올라가며 다음 장으로 넘어간다
    tl.to({}, { duration: 0.4 }, 0)
      .to(all(el, ".cover__head .mask__in"), { yPercent: -120, duration: 0.8, stagger: 0.05, ease: "power3.in" }, 0.4)
      .to(all(el, "[data-side]"), { opacity: 0, y: -20, duration: 0.6, stagger: 0.05, ease: "power2.in" }, 0.4);
    steps(tl, [0]);
  });

  return (
    <section ref={ref} id="top" className="scene" style={{ ["--len" as string]: 1.6 }} data-haze="0.65" data-tone="0" data-label="From AI to AX">
      <div className="stage cover">
        <div className="cover__head" data-reveal>
          <Mask>
            <span className="eyebrow cover__kicker"><span className="cover__tri" aria-hidden="true">▲</span>SIAPLAN AI/AX TF · Explainer</span>
          </Mask>
          <h1 className="poster cover__title">
            <Mask><span className="cover__small">From</span>AI <span className="cover__small">to</span><mark className="hl hl--on">AX</mark></Mask>
          </h1>
          <p className="poster cover__sub"><Mask>: SID_E STEP</Mask></p>
          <Mask>
            <p className="cover__deck">개인의 AI 활용에서 조직의 AX 혁신으로. 무엇을, 어떻게, 언제 바꾸는지 {CHAPTERS.length}개의 장으로 정리했습니다.</p>
          </Mask>
          <Mask><p className="eyebrow cover__by">SID · 2026.11 · 읽는 데 3분 · Scroll ↓</p></Mask>
        </div>

        <div className="cover__side" data-reveal>
          <p className="poster-sm" data-side>SIAPLAN<br />AI/AX TEAM TF</p>
          <ul className="underscore cover__lines" data-side>
            {POSTER_LINES.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
