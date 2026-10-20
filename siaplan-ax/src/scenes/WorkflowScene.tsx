import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { all, useScrollScene } from "../lib/motion";

// SIAPLAN AI/AX 6단계 AI 워크플로우 (개발일지 정의)
const STEPS = [
  { t: "Define", q: "What is the real problem?", k: "문제 정의 — 무엇을 풀어야 하는가" },
  { t: "Decompose", q: "Break it into tasks.", k: "설계 업무를 Task로 분해 — AI 개입 지점 정의" },
  { t: "Context", q: "Data · Rules · Project · Knowledge.", k: "데이터 · 법규 · 프로젝트 · 사내 지식" },
  { t: "Generate", q: "Ideas · Options · Alternatives.", k: "AI로 아이디어와 대안 생성" },
  { t: "Evaluate", q: "Analyze · Check · Compare.", k: "기준에 비추어 분석 · 검토 · 비교" },
  { t: "Iterate", q: "Refine · Improve · Repeat.", k: "다듬고 개선하고 반복 — 시스템으로" }
];
const STEP = 1.3;

export function WorkflowScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const items = all(el, ".wf__item");
    const titles = all(el, ".wf__title");
    const lines = all(el, ".cli__line");

    STEPS.forEach((_, i) => {
      const at = i * STEP;
      const t = titles[i].querySelectorAll(".mask__in");
      tl.fromTo(items[i], { color: "#c9c9c9" }, { color: "#171717", duration: 0.2 }, at)
        .fromTo(items[i].querySelector(".wf__tick"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out" }, at)
        .fromTo(t, { yPercent: 110 }, { yPercent: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, at)
        .fromTo([lines[i * 2], lines[i * 2 + 1]], { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.2 }, at + 0.15);
      if (i < STEPS.length - 1) {
        tl.to(t, { yPercent: -110, duration: 0.45, stagger: 0.05, ease: "power3.in" }, at + STEP - 0.45)
          .to(items[i], { color: "#a8a8a8", duration: 0.2 }, at + STEP)
          .to(items[i].querySelector(".wf__tick"), { scaleX: 0, duration: 0.2 }, at + STEP);
      }
    });
    tl.to({}, { duration: 0.8 }, STEPS.length * STEP);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-label="The new workflow">
      <div className="stage wf">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>03 — The new workflow</p>

        <ol className="wf__list" data-reveal>
          {STEPS.map((s, i) => (
            <li key={s.t} className="wf__item">
              <span className="eyebrow wf__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="heading wf__name">{s.t}</span>
              <span className="wf__tick" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="wf__stage">
          {STEPS.map((s, i) => (
            <div key={s.t} className="wf__title" data-reveal>
              <Mask className="eyebrow eyebrow--muted">{`Step ${String(i + 1).padStart(2, "0")} / 06`}</Mask>
              <Mask className="display">{s.t}</Mask>
              <Mask className="heading wf__q">{s.q}</Mask>
            </div>
          ))}
        </div>

        <div className="card cli" data-reveal>
          <div className="cli__bar">
            <span className="eyebrow eyebrow--muted">workflow.log</span>
            <span className="cli__dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <ul className="cli__body">
            {STEPS.flatMap((s) => [
              <li key={`${s.t}c`} className="cli__line"><span className="glyph">×</span> {s.t.toLowerCase()}</li>,
              <li key={`${s.t}o`} className="cli__line cli__line--out"><span className="ok">✓</span> {s.k}</li>
            ])}
          </ul>
        </div>
      </div>
    </section>
  );
}
