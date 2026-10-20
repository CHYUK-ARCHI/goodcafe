import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { NetLines, type NetLine } from "../lib/NetLines";
import { Pin } from "../lib/Pin";
import { all, steps, useScrollScene } from "../lib/motion";

// 네트워크 박스(%) 좌표
const ARCH = { x: 10, y: 50 };
const AGENTS = [{ x: 38, y: 28 }, { x: 38, y: 72 }];
const TOOLS = [
  { t: "CAD", y: 10, a: 0 }, { t: "BIM", y: 28, a: 0 }, { t: "Rhino", y: 46, a: 0 },
  { t: "Regulation", y: 62, a: 1 }, { t: "Data", y: 78, a: 1 }, { t: "Visualization", y: 94, a: 1 }
];
const TX = 66;
const OUT = { x: 92, y: 50 };

const NET: NetLine[] = [
  ...AGENTS.map((g) => ({ x1: ARCH.x, y1: ARCH.y, x2: g.x, y2: g.y })),
  ...TOOLS.map((t) => ({ x1: AGENTS[t.a].x, y1: AGENTS[t.a].y, x2: TX, y2: t.y })),
  ...TOOLS.map((t) => ({ x1: TX, y1: t.y, x2: OUT.x, y2: OUT.y, hair: true }))
];

export function OrchestratorScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const old = all(el, ".orch__old li");
    // 첫 프레임은 기존 선형 구조로 시작한다
    tl.to({}, { duration: 1.2 }, 0)
      // 선형 구조에 취소선이 그어지며 해체된다
      .fromTo(el.querySelector("[data-strike]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 1.6)
      .to(old, { color: "#c9c9c9", duration: 0.5 }, 1.9)
      // 새 구조: 건축가가 중심, 에이전트와 도구를 조율한다
      .fromTo(all(el, "[data-node='arch']"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 2.6)
      .fromTo(all(el, ".orch__net line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 3.1)
      .fromTo(all(el, "[data-node='agent']"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: "back.out(1.7)" }, 3.2)
      .fromTo(all(el, "[data-node='tool']"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.7)" }, 3.7)
      .fromTo(all(el, "[data-node='out']"), { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.7)" }, 5)
      .fromTo(all(el, ".orch__head .mask__in"), { yPercent: 130 }, { yPercent: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }, 6)
      .fromTo(el.querySelector("[data-sub]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 6.8)
      .to({}, { duration: 1.6 }, 7.4);
    steps(tl, [0, 2.4, 5.6, 9.0]);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-haze="0.26" data-tone="0.45" data-label="Human × Agent × Tool">
      <div className="stage orch">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_05 Human × Agent × Tool</p>

        <div className="orch__oldbox" data-reveal>
          <p className="eyebrow eyebrow--muted">Old</p>
          <ol className="orch__old">
            <li className="heading">Architect</li>
            <li className="orch__arrow" aria-hidden="true">↓</li>
            <li className="heading">Tool</li>
            <li className="orch__arrow" aria-hidden="true">↓</li>
            <li className="heading">Output</li>
          </ol>
          <svg className="orch__strike" aria-hidden="true">
            <line x1="0%" y1="8%" x2="100%" y2="92%" pathLength={1} strokeDasharray={1} data-strike />
          </svg>
        </div>

        <div className="orch__net" data-reveal>
          <p className="eyebrow orch__newtag">New</p>
          <NetLines lines={NET} />
          <Pin x={ARCH.x} y={ARCH.y} className="chip chip--ink" data-node="arch">Architect</Pin>
          {AGENTS.map((g, i) => (
            <Pin key={i} x={g.x} y={g.y} className="chip" data-node="agent">
              <span className="ok">●</span> AI Agent {String.fromCharCode(65 + i)}
            </Pin>
          ))}
          {TOOLS.map((t) => (
            <Pin key={t.t} x={TX} y={t.y} className="chip chip--ghost" data-node="tool">{t.t}</Pin>
          ))}
          <Pin x={OUT.x} y={OUT.y} className="chip chip--ink" data-node="out">Output</Pin>
        </div>

        <div className="orch__headbox" data-reveal>
          <h2 className="heading-lg orch__head">
            <Mask>The architect</Mask>
            <Mask>as orchestrator.</Mask>
          </h2>
          <p className="body orch__sub" data-sub>
            모든 툴을 직접 다루는 사람이 아니라, AI·Agent·Tool을 조율해 결과를 만드는 사람.
          </p>
        </div>
      </div>
    </section>
  );
}
