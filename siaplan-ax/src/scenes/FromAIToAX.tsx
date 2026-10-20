import { useRef } from "react";
import { Axo } from "../lib/Axo";
import { Mask } from "../lib/Mask";
import { all, useScrollScene } from "../lib/motion";

const STEPS = [
  { t: "AI", d: "하나의 도구" },
  { t: "Task", d: "업무 단위로 쪼갠다" },
  { t: "Workflow", d: "Task를 흐름으로 잇는다" },
  { t: "System", d: "흐름을 조직의 체계로 만든다" }
];
// 판마다 강조 셀 — 위로 갈수록 연결된 영역이 넓어진다
const MARKS: [number, number, ("ink" | "accent" | "ash")?][][] = [
  [[2, 2]],
  [[1, 1], [2, 2, "ash"], [4, 3, "ash"]],
  [[1, 1, "ash"], [2, 1, "ash"], [2, 2], [3, 2, "ash"], [4, 3]],
  [[1, 1], [2, 1], [3, 1], [1, 2], [2, 2], [3, 2, "accent"], [4, 3], [4, 4]]
];
const GAP = 62;

export function FromAIToAX() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const rows = all(el, ".chain__row");
    const plates = all(el, ".axo__plate");

    // 판이 하나씩 위에서 내려와 쌓인다 (exploded)
    plates.forEach((pl, k) => {
      tl.fromTo(pl, { y: -k * GAP - 160, opacity: 0 }, { y: -k * GAP, opacity: 1, duration: 0.9, ease: "power3.out" }, 0.3 + k * 1.1);
    });
    rows.forEach((row, i) => {
      tl.fromTo(row, { color: "#c9c9c9" }, { color: "#171717", duration: 0.3 }, 0.3 + i * 1.1);
      if (i > 0) tl.to(rows[i - 1], { color: "#c9c9c9", duration: 0.3 }, 0.3 + i * 1.1);
    });
    // 조립: 판 사이 간격이 닫히며 하나의 체계가 된다 → AX
    tl.to(plates, { y: (k: number) => -k * 7, duration: 1.4, ease: "power3.inOut" }, 5)
      .to(all(el, ".chain__row .mask__in"), { yPercent: -110, duration: 0.8, stagger: 0.06, ease: "power3.in" }, 5)
      // 번호·설명·구분선까지 함께 치워 AX 와 겹치지 않게 한다
      .to(rows, { opacity: 0, duration: 0.6, ease: "power2.in" }, 5.2)
      .to(all(el, ".axo__label"), { opacity: 0, duration: 0.5 }, 5)
      .fromTo(el.querySelector("[data-ax]"), { yPercent: 110 }, { yPercent: 0, duration: 1, ease: "power3.out" }, 6)
      .fromTo(all(el, "[data-key]"), { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }, 6.6)
      .fromTo(el.querySelector("[data-note]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 7.3)
      .to({}, { duration: 1.2 }, 8);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5 }} data-haze="0.2" data-tone="0" data-label="From AI to AX">
      <div className="stage split">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_01 From AI to AX</p>

        <div className="split__left">
          <ol className="chain" data-reveal>
            {STEPS.map((s, i) => (
              <li key={s.t} className="chain__row">
                <span className="eyebrow eyebrow--muted chain__idx">{String(i + 1).padStart(2, "0")}</span>
                <Mask className="heading-lg chain__word">{s.t}</Mask>
                <span className="caption chain__desc">{s.d}</span>
              </li>
            ))}
          </ol>
          <div className="ax-block">
            <Mask className="ax-word"><span data-ax>AX</span></Mask>
            <div className="ax-keys">
              {["Workflow", "System", "People"].map((k) => (
                <Mask key={k}><span className="eyebrow" data-key>{k}</span></Mask>
              ))}
            </div>
            <p className="body ax-note" data-note>
              AI 하나를 쓰는 것이 아니라, 업무 전체 흐름 안에 AI를 배치합니다.
              <br />
              <span className="caption">AX = Workflow + System + People 을 다시 짜는 일.</span>
            </p>
          </div>
        </div>

        <div className="split__right" data-reveal>
          <Axo n={6} plates={4} gap={GAP} labels={["AI", "TASK", "WORKFLOW", "SYSTEM"]} marks={MARKS} />
        </div>
      </div>
    </section>
  );
}
