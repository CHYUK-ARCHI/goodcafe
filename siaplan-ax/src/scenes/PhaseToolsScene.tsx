import { useRef } from "react";
import { all, steps, useScrollScene } from "../lib/motion";

// 설계 단계별로 지금 쓰는 툴과, 그 위에 얹는 SIA AI 지원, 그리고 단계별 목표
const PHASES = [
  {
    p: "Competition",
    ko: "기획 · 현상설계",
    tools: ["Rhino / Grasshopper", "SketchUp", "AutoCAD", "Photoshop"],
    ai: ["규모검토 · 법규 — Legal CAD", "이미지 · 스타일 — Rendering Prompt · Style Lab", "설명 영상 — Video workflow"],
    goal: "현상설계 10일"
  },
  {
    p: "SD",
    ko: "계획설계",
    tools: ["AutoCAD", "Rhino", "면적표 (Excel)"],
    ai: ["법규 체크리스트 자동화", "매스 대안 비교", "유사 사례 — SID-DB"],
    goal: "규모검토 · 법규 3일"
  },
  {
    p: "DD",
    ko: "기본설계",
    tools: ["Revit / BIM", "AutoCAD", "Enscape / D5"],
    ai: ["CAD · BIM 연동 — CAD MCP", "입면 · 재료 스터디", "디테일 참조 — SID-DB"],
    goal: "BIM 연동"
  },
  {
    p: "CD",
    ko: "실시설계",
    tools: ["AutoCAD + LISP", "Revit", "도면 체크리스트"],
    ai: ["공용 도구 — SIAPLAN Add-on", "도면 체크 자동화", "도서 · 데이터 정리"],
    goal: "SIAPLAN Add-on"
  }
];

export function PhaseToolsScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const cols = all(el, ".ph__col");
    cols.forEach((c, i) => {
      const at = 0.2 + i * 0.9;
      tl.fromTo(c, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, at)
        .fromTo(c.querySelectorAll(".ph__ai li"), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.3, stagger: 0.12 }, at + 0.35);
    });
    tl.fromTo(all(el, ".ph__link"), { scaleY: 0 }, { scaleY: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }, 4)
      .fromTo(el.querySelector("[data-pmsbar]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 4.3)
      .fromTo(el.querySelector("[data-pmsflow]"), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 4.7)
      .to({}, { duration: 1.2 }, 5.7);
    steps(tl, [3.9, 6.9]);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 4.5 }} data-haze="0.28" data-tone="0.9" data-label="Tools by phase × PMS">
      <div className="stage ph">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_07 Tools by phase × PMS</p>
        <h2 className="heading ph__lede" data-reveal>
          설계 단계마다 쓰는 툴은 그대로, <b>그 위에 SIA AI를 얹고 PMS로 묶습니다.</b>
        </h2>

        <ol className="ph__grid">
          {PHASES.map((ph) => (
            <li key={ph.p} className="card ph__col" data-reveal>
              <p className="eyebrow eyebrow--muted">{ph.p}</p>
              <h3 className="heading ph__title">{ph.ko}</h3>
              <p className="eyebrow ph__label">Tools</p>
              <ul className="ph__tools">{ph.tools.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="eyebrow ph__label">+ SIA AI</p>
              <ul className="ph__ai">{ph.ai.map((a) => <li key={a}><span className="ok">✓</span> {a}</li>)}</ul>
              <span className="chip chip--ink ph__goal">→ {ph.goal}</span>
              <span className="ph__link" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="card card--inverted ph__pms" data-pmsbar data-reveal>
          <span className="eyebrow ph__pmstag">PMS</span>
          <span className="ph__pmsflow" data-pmsflow aria-hidden="true" />
          <p className="ph__pmstext">
            프로젝트 코드 · 일정 · 인력 · 산출물 <span className="ph__arrow">⇄</span> SIA Studio
            <span className="ph__pmsnote">업무 기록과 단계별 소요 시간이 자동으로 쌓여, 효율 개선을 숫자로 확인합니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
