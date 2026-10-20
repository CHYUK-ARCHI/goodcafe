import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { NameMark } from "../lib/NameMark";
import { CASES, LESSONS } from "../lib/cases";
import { all, steps, useScrollScene } from "../lib/motion";

const byId = Object.fromEntries(CASES.map((c) => [c.id, c]));

// 6개월 로드맵(Roadmap 장면)과 같은 구간
const PLAN = [
  { when: "Now", what: "TF 구성 · AI 계정 · 교육" },
  { when: "M01–M03", what: "SID-DB · Legal CAD 3일 파일럿" },
  { when: "M04–M06", what: "지난 공모 10일 재현 · SIA Studio 통합" }
];

/** 사례 분석 → 우리가 움직일 방향. 행 두 개씩 들어오고 마지막에 실행 계획이 붙는다. */
export function OurMoveScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const rows = all(el, ".move__row");
    const plan = el.querySelector(".move__plan");
    // 첫 두 행은 장면 진입과 함께, 나머지는 한 스텝에 두 행씩
    [0, 1, 2].forEach((g) => {
      const at = g === 0 ? 0.2 : 1 + (g - 1);
      tl.fromTo(rows.slice(g * 2, g * 2 + 2), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" }, at);
    });
    tl.fromTo(plan, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 3);
    tl.to({}, { duration: 0.6 }, 3.6);
    steps(tl, [0.9, 1.7, 2.7, 3.7]);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 4.5 }} data-haze="0.3" data-tone="0.2" data-label="Our move">
      <div className="stage move">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_03 Our move</p>

        <header className="move__head" data-reveal>
          <h2 className="poster move__title">
            <Mask>What we</Mask>
            <Mask>learned.</Mask>
            <Mask>What we</Mask>
            <Mask>do next.</Mask>
          </h2>
          <p className="move__ko" lang="ko">사례에서 읽은 여섯 가지 패턴을, SIAPLAN 의 문제(P01–P04)와 목표에 하나씩 연결했습니다.</p>
        </header>

        <div className="move__body">
          <ol className="move__list">
            {LESSONS.map((l, i) => (
              <li key={l.en} className="move__row" data-reveal>
                <span className="eyebrow eyebrow--muted move__n">{String(i + 1).padStart(2, "0")}</span>
                <div className="move__lesson">
                  <p className="move__en">{l.en}</p>
                  <p className="move__seen">
                    <span className="move__marks">{l.seen.map((id) => <NameMark key={id} c={byId[id]} size="sm" />)}</span>
                    {l.seenNote}
                  </p>
                </div>
                <span className="move__arrow" aria-hidden="true">→</span>
                <div className="move__do">
                  <p lang="ko">{l.move}</p>
                  <p className="move__meta">
                    <span className="move__when">{l.when}</span>
                    {l.fix.map((f) => <span key={f} className="move__fix">{f}</span>)}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="move__plan" data-reveal>
            <span className="eyebrow">_Plan</span>
            {PLAN.map((p, i) => (
              <p key={p.when} className="move__step">
                <span className={`move__when${i === 0 ? " move__when--now" : ""}`}>{p.when}</span> {p.what}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
