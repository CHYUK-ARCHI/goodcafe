import { useRef } from "react";
import { Axo, type AxoMark } from "../lib/Axo";
import { all, useScrollScene } from "../lib/motion";

// 아래(데이터)에서 위(작업 공간)로 쌓이는 SIAPLAN AI/AX 플랫폼, 그리고 PMS 연동
const LAYERS = [
  {
    t: "SID-DB",
    sub: "참고자료 · 프로젝트 DB",
    d: "참고자료와 우리가 수행한 프로젝트 자료를 한곳에 모아, 한 번에 찾아보고 다시 씁니다.",
    tags: ["참고자료", "과거 프로젝트", "도면 · 이미지", "태그 검색"]
  },
  {
    t: "SIA AI",
    sub: "설계 판단을 돕는 AI",
    d: "규모검토·법규체크, 이미지·영상, 자료 검색을 AI와 Agent가 수행합니다.",
    tags: ["Legal CAD", "CAD MCP", "Rendering Prompt", "Style Lab"]
  },
  {
    t: "SIA Studio",
    sub: "Workflow 재구축 작업 공간",
    d: "설계 단계별 workflow 템플릿과 SIAPLAN Add-on을 한곳에서 꺼내 씁니다.",
    tags: ["Workflow 템플릿", "SIAPLAN Add-on", "Video workflow", "Onboarding"]
  },
  {
    t: "PMS 연동",
    sub: "Project Management System",
    d: "프로젝트 일정·인력·산출물을 SIA Studio와 연결해, 업무 기록과 효율 지표가 자동으로 쌓이게 합니다.",
    tags: ["프로젝트 코드", "일정", "인력", "산출물 · 업무 기록"]
  }
];
const MARKS: AxoMark[][] = [
  [[0, 0, "ash"], [1, 0, "ash"], [0, 1, "ash"], [4, 4, "ash"], [5, 4, "ash"], [4, 5, "ash"], [2, 3, "ash"]],
  [[2, 2], [3, 2], [2, 3], [3, 3, "accent"]],
  [[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [4, 2], [1, 3], [4, 3], [1, 4], [2, 4], [3, 4], [4, 4]]
];
const STEP = 1.4;

export function PlatformScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const rows = all(el, ".plat__row");
    const descs = all(el, ".plat__desc");
    const plates = all(el, ".axo__plate");
    const pms = el.querySelector("[data-pms]");

    LAYERS.forEach((_, i) => {
      const at = i * STEP;
      const isPms = i === LAYERS.length - 1;
      if (i > 0) {
        tl.fromTo(rows[i], { color: "#c9c9c9" }, { color: "#171717", duration: 0.2 }, at)
          .fromTo(descs[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.1);
      }
      // 현재 레이어만 진하게, 나머지는 흐리게 (PMS 단계에서는 전체를 다시 켠다)
      plates.forEach((pl, k) => {
        tl.to(pl, { opacity: isPms || k === i ? 1 : 0.22, duration: 0.3 }, at);
      });
      if (!isPms) {
        tl.to(rows[i], { color: "#a8a8a8", duration: 0.2 }, at + STEP)
          .to(descs[i], { opacity: 0, y: -14, duration: 0.2 }, at + STEP);
      }
    });
    const end = LAYERS.length * STEP;
    tl.fromTo(pms, { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" }, (LAYERS.length - 1) * STEP + 0.2)
      .fromTo(el.querySelector("[data-pmsline]"), { scaleX: 0 }, { scaleX: 1, duration: 0.4 }, (LAYERS.length - 1) * STEP + 0.5)
      .to(rows, { color: "#171717", duration: 0.4 }, end)
      .to({}, { duration: 1 }, end + 0.4);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5.5 }} data-haze="0.3" data-label="SIA Studio · SIA AI">
      <div className="stage plat">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_06 The platform we build</p>

        <div className="plat__left" data-reveal>
          <h2 className="heading plat__lede">
            Workflow를 다시 짓기 위해
            <br />
            <b>SIA Studio</b>와 <b>SIA AI</b>를 구축합니다.
          </h2>
          <ol className="plat__list">
            {LAYERS.map((l, i) => (
              <li key={l.t} className="plat__row">
                <span className="eyebrow eyebrow--muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading-lg plat__word">{l.t}</span>
                <span className="caption plat__sub">{l.sub}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="plat__side" data-reveal>
          <div className="plat__stack">
            <Axo n={6} plates={3} gap={78} labels={["SID-DB", "SIA AI", "SIA STUDIO"]} marks={MARKS} />
            <div className="plat__pms" data-pms>
              <span className="plat__pmsline" data-pmsline aria-hidden="true" />
              <span className="chip chip--ink">PMS</span>
            </div>
          </div>
          <div className="card plat__card">
            {LAYERS.map((l) => (
              <div key={l.t} className="plat__desc">
                <p className="eyebrow">{l.t}</p>
                <p className="body">{l.d}</p>
                <p className="plat__tags">{l.tags.map((t) => <span key={t} className="chip chip--ghost">{t}</span>)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
