import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { PROBLEMS } from "../lib/problems";
import { all, steps, useScrollScene } from "../lib/motion";

// 한 화면에 한 문제. 크게 영어, 오른쪽 아래에 작게 한글.
const ITEMS = [
  ...PROBLEMS.map((p) => ({ label: `_Problem ${p.id.slice(1)}`, en: p.en, ko: p.ko, meta: "Goal", goal: p.goal })),
  {
    label: "_So",
    en: ["Not a tool problem.", "A workflow problem."],
    ko: "도구의 문제가 아니라, 일하는 방식의 문제입니다.",
    meta: "Next",
    goal: "Define · Decompose · Context · Generate · Evaluate · Iterate"
  }
];
const STEP = 1.3;

export function ProblemScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const items = all(el, ".prob__item");
    const n = ITEMS.length;
    items.forEach((item, i) => {
      const at = i * STEP;
      const lines = item.querySelectorAll(".prob__text .mask__in");
      const meta = item.querySelectorAll("[data-meta]");
      // 첫 문제는 장면 시작부터 보인다
      if (i > 0) {
        tl.fromTo(lines, { yPercent: 130 }, { yPercent: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }, at)
          .fromTo(meta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35 }, at + 0.15);
      }
      if (i < n - 1) {
        tl.to(lines, { yPercent: -130, duration: 0.45, stagger: 0.05, ease: "power3.in" }, at + STEP - 0.45)
          .to(meta, { opacity: 0, duration: 0.25 }, at + STEP - 0.45);
      }
    });
    tl.to({}, { duration: 0.8 }, (n - 1) * STEP + 0.6);
    steps(tl, ITEMS.map((_, i) => (i === 0 ? 0 : i * STEP + 0.6)));
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 4.5 }} data-haze="0.3" data-tone="0" data-label="Problem">
      <div className="stage prob">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_01 Problem</p>
        <ol className="prob__list">
          {ITEMS.map((it) => (
            <li key={it.label} className="prob__item" data-reveal>
              <p className="eyebrow prob__label" data-meta>{it.label}</p>
              <h2 className="poster prob__text">
                {it.en.map((line) => <Mask key={line}>{line}</Mask>)}
              </h2>
              <p className="prob__goal" data-meta>
                <span className="eyebrow eyebrow--muted">{it.meta}</span> {it.goal}
              </p>
              <p className="prob__ko" data-meta lang="ko">{it.ko}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
