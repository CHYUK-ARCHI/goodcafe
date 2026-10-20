import { useRef } from "react";
import { all, useScrollScene } from "../lib/motion";

// 6개월 로드맵 — 목표(Goals)를 향해 매달 해야 할 중간 작업
const MONTHS = [
  {
    n: "01", t: "Discover", s: "현황 조사",
    tasks: ["설계 단계별 사용 툴 · 업무시간 조사", "사내 LISP · add-on 수집 · 목록화", "PMS 데이터 구조 파악", "SID-DB 분류 체계 설계"],
    goals: ["Add-on", "SID-DB", "PMS"]
  },
  {
    n: "02", t: "Prototype", s: "시제품",
    tasks: ["SIA AI 규모검토 · 법규 프로토타입", "SID-DB 1차 적재 (최근 프로젝트)", "동영상 workflow 파일럿", "SIA Studio 화면 설계"],
    goals: ["3일", "Video", "SID-DB"]
  },
  {
    n: "03", t: "Pilot · SD", s: "계획설계 적용",
    tasks: ["실프로젝트 규모검토 · 법규 3일 파일럿", "SIAPLAN Add-on v0.1 (LISP 통합)", "PMS 연동 설계 (프로젝트 코드 · 일정)"],
    goals: ["3일", "Add-on", "PMS"]
  },
  {
    n: "04", t: "Expand · DD", s: "현상 · 기본설계 확장",
    tasks: ["현상설계 10일 파일럿 (공모 1건)", "CAD MCP · BIM 연동", "동영상 workflow 템플릿 표준화"],
    goals: ["10일", "Video"]
  },
  {
    n: "05", t: "Integrate · CD", s: "실시설계 통합",
    tasks: ["도면 체크 자동화", "SIAPLAN Add-on v1.0 배포", "SID-DB AI 검색", "PMS ⇄ SIA Studio 연동"],
    goals: ["Add-on", "SID-DB", "PMS"]
  },
  {
    n: "06", t: "System", s: "체계화",
    tasks: ["SIA Studio · SIA AI 통합 오픈", "목표 지표 측정 (10일 · 3일)", "전사 교육 · 온보딩", "다음 6개월 계획"],
    goals: ["10일", "3일"]
  }
];

export function RoadmapScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const nodes = all(el, ".rm__node");
    const cards = all(el, ".rm__card");
    const n = MONTHS.length;

    tl.fromTo(el.querySelector("[data-rail]"), { scaleX: 0 }, { scaleX: 1, duration: n, ease: "none" }, 0.3);
    MONTHS.forEach((_, i) => {
      const at = 0.3 + i;
      tl.fromTo(nodes[i], { backgroundColor: "#fafafa" }, { backgroundColor: "#171717", duration: 0.15 }, at)
        .fromTo(cards[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, at)
        .fromTo(cards[i].querySelectorAll(".rm__tasks li"), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.08 }, at + 0.25);
    });
    tl.to({}, { duration: 1.2 }, n + 0.3);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5.5 }} data-label="6 month roadmap">
      <div className="stage rm">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>09 — 6 month roadmap</p>
        <div className="rm__timeline" aria-hidden="true">
          <span className="eyebrow">Now</span>
          <div className="rm__track">
            <span className="rm__rail" data-rail />
            {MONTHS.map((m) => <span key={m.n} className="rm__node" />)}
          </div>
          <span className="eyebrow eyebrow--muted">6 months</span>
        </div>
        <ol className="rm__grid">
          {MONTHS.map((m, i) => (
            <li key={m.n} className={`card rm__card${i === 0 ? " card--inverted" : ""}`} data-reveal>
              <p className="eyebrow rm__n">
                <span>{m.n} — {m.s}</span>
                {i === 0 && <span className="rm__here"><span className="ok">●</span> Now</span>}
              </p>
              <h3 className="heading rm__title">{m.t}</h3>
              <ul className="rm__tasks">{m.tasks.map((t) => <li key={t}>{t}</li>)}</ul>
              <p className="rm__goals">{m.goals.map((g) => <span key={g} className="rm__goal">→ {g}</span>)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
