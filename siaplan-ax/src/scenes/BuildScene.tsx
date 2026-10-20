import { useRef } from "react";
import { Axo } from "../lib/Axo";
import { all, useScrollScene } from "../lib/motion";

const ITEMS = [
  { t: "Design Automation", d: "반복되는 설계 Task를 자동화합니다.", tags: ["Task", "Automation"], cells: [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2]] },
  { t: "Regulation", d: "법규 검토를 도면 작업과 연결합니다.", tags: ["Legal CAD"], cells: [[5, 0], [6, 0], [7, 0], [7, 1], [7, 2]] },
  { t: "CAD / BIM", d: "AI가 CAD·BIM 도구를 직접 다루게 합니다.", tags: ["CAD MCP"], cells: [[0, 4], [1, 4], [0, 5], [1, 5], [2, 5]] },
  { t: "Knowledge", d: "사내 지식을 쌓고 새 구성원에게 전달합니다.", tags: ["Onboarding"], cells: [[4, 3], [5, 3], [4, 4]] },
  { t: "Agents", d: "건축가가 조율하는 AI·Agent를 설계합니다.", tags: ["AI", "Agent"], cells: [[6, 5], [6, 6], [5, 6]] },
  { t: "Visualization", d: "렌더링과 스타일 스터디를 빠르게 만듭니다.", tags: ["Rendering Prompt", "Style Lab"], cells: [[2, 7], [3, 7], [3, 6], [2, 6]] },
  { t: "Workflow", d: "개별 서비스를 하나의 흐름으로 잇습니다.", tags: ["Connect", "Standardize", "Scale"], cells: [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]] }
];
const STEP = 1.2;

export function BuildScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const rows = all(el, ".build__row");
    const descs = all(el, ".build__desc");
    const cellsOf = (i: number) => ITEMS[i].cells.map(([x, y]) => el.querySelector(`[data-cell="${x}-${y}"]`)).filter(Boolean) as Element[];
    const n = ITEMS.length;

    ITEMS.forEach((_, i) => {
      const at = i * STEP;
      const last = i === n - 1;
      tl.fromTo(rows[i], { color: "#c9c9c9" }, { color: "#171717", duration: 0.2 }, at)
        .fromTo(rows[i].querySelector(".build__arrow"), { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }, at)
        .fromTo(cellsOf(i), { fill: "rgba(23,23,23,0)" }, { fill: last ? "#297a3a" : "#171717", duration: 0.3, stagger: 0.04 }, at)
        .fromTo(descs[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.1);
      if (!last) {
        tl.to(rows[i], { color: "#a8a8a8", duration: 0.2 }, at + STEP)
          .to(rows[i].querySelector(".build__arrow"), { opacity: 0, duration: 0.2 }, at + STEP)
          .to(cellsOf(i), { fill: "#c9c9c9", duration: 0.2 }, at + STEP)
          .to(descs[i], { opacity: 0, y: -14, duration: 0.2 }, at + STEP);
      }
    });
    // 마지막: 모든 항목이 하나의 방향으로 모인다
    const end = n * STEP;
    tl.to(rows, { color: "#171717", duration: 0.4, stagger: 0.04 }, end)
      .to(ITEMS.slice(0, -1).flatMap((_, i) => cellsOf(i)), { fill: "#171717", duration: 0.4 }, end)
      .fromTo(el.querySelector("[data-one]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, end + 0.3)
      .to({}, { duration: 1 }, end + 0.8);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-label="What we build">
      <div className="stage build">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>05 — What we build</p>

        <ol className="build__list" data-reveal>
          {ITEMS.map((it, i) => (
            <li key={it.t} className="build__row">
              <span className="eyebrow eyebrow--muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="heading-lg build__word">{it.t}</span>
              <span className="build__arrow" aria-hidden="true">→</span>
            </li>
          ))}
        </ol>

        <div className="build__side" data-reveal>
          <Axo n={8} plates={1} labels={["SIAPLAN AX"]} className="build__axo" />
          <div className="card build__card">
            {ITEMS.map((it) => (
              <div key={it.t} className="build__desc">
                <p className="eyebrow">{it.t}</p>
                <p className="body">{it.d}</p>
                <p className="build__tags">{it.tags.map((t) => <span key={t} className="chip chip--ghost">{t}</span>)}</p>
              </div>
            ))}
          </div>
          <p className="caption build__one" data-one>
            <span className="eyebrow">One direction</span>&nbsp;&nbsp;Legal CAD · CAD MCP · Rendering Prompt · Onboarding · Style Lab — 개별 앱이 아니라 하나의 체계로.
          </p>
        </div>
      </div>
    </section>
  );
}
