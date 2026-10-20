import { useRef } from "react";
import { all, useScrollScene } from "../lib/motion";

const STEPS = [
  { n: "01", t: "Discover", k: ["Workflow", "Pain point", "Task"] },
  { n: "02", t: "Prototype", k: ["AI", "Agent", "Automation"] },
  { n: "03", t: "SD", k: ["Site", "Program", "Massing", "Regulation"] },
  { n: "04", t: "DD", k: ["Facade", "Structure", "Environment", "BIM"] },
  { n: "05", t: "CD", k: ["Drawing", "Check", "Document", "Data"] },
  { n: "06", t: "System", k: ["Connect", "Standardize", "Scale"] }
];

export function RoadmapScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const nodes = all(el, ".rm__node");
    const cards = all(el, ".rm__card");
    const n = STEPS.length;

    tl.fromTo(el.querySelector("[data-rail]"), { scaleX: 0 }, { scaleX: 1, duration: n, ease: "none" }, 0.3);
    STEPS.forEach((_, i) => {
      const at = 0.3 + i;
      tl.fromTo(nodes[i], { backgroundColor: "#fafafa" }, { backgroundColor: "#171717", duration: 0.15 }, at)
        .fromTo(cards[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, at);
    });
    tl.to({}, { duration: 1.2 }, n + 0.3);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5 }} data-label="6 month roadmap">
      <div className="stage rm">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>07 — 6 month roadmap</p>
        <div className="rm__timeline" aria-hidden="true">
          <span className="eyebrow">Now</span>
          <div className="rm__track">
            <span className="rm__rail" data-rail />
            {STEPS.map((s) => <span key={s.n} className="rm__node" />)}
          </div>
          <span className="eyebrow eyebrow--muted">6 months</span>
        </div>
        <ol className="rm__grid">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`card rm__card${i === 0 ? " card--inverted" : ""}`} data-reveal>
              <p className="eyebrow rm__n">
                {s.n}
                {i === 0 && <span className="rm__here"><span className="ok">●</span> We are here</span>}
              </p>
              <h3 className="heading rm__title">{s.t}</h3>
              <ul className="rm__keys">{s.k.map((k) => <li key={k}>{k}</li>)}</ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
