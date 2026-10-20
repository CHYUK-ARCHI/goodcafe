import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { all, useScrollScene } from "../lib/motion";

export const GOALS = [
  {
    n: "10",
    u: "days",
    t: "10일 만에 현상설계",
    d: "공모 공고부터 제출까지 10일. 규모검토 · 매스 대안 · 이미지 · 패널 제작을 AI workflow로 압축합니다.",
    how: ["SIA AI 규모·법규 검토", "Rendering Prompt · Style Lab", "패널 · 영상 템플릿"]
  },
  {
    n: "3",
    u: "days",
    t: "규모검토 · 법규체크 3일 완성",
    d: "대지 분석부터 법정 규모 · 주차 · 법규 체크리스트까지, 3일 안에 검토서를 완성합니다.",
    how: ["Legal CAD", "법규 체크리스트 자동화", "SID-DB 유사 사례"]
  },
  {
    n: "1",
    u: "video workflow",
    t: "동영상 workflow",
    d: "설계안 설명 영상과 모션그래픽을 템플릿으로 만들어, 프로젝트마다 처음부터 다시 만들지 않습니다.",
    how: ["HyperFrames 템플릿", "AI 영상 · 이미지", "표준 스토리보드"]
  },
  {
    n: "1",
    u: "add-on package",
    t: "SIAPLAN만의 Add-on",
    d: "각자 쓰던 LISP와 add-on을 모아 검증 · 정리하고, SIAPLAN 공용 add-on 패키지로 배포합니다.",
    how: ["LISP · add-on 수집", "중복 정리 · 표준화", "배포 · 버전 관리"]
  },
  {
    n: "1",
    u: "SID-DB",
    t: "SID-DB 구축",
    d: "참고자료와 우리가 했던 프로젝트 자료를 한 번에 몰아볼 수 있는 DB를 만듭니다.",
    how: ["분류 체계 · 태그", "과거 프로젝트 적재", "AI 검색"]
  }
];
const STEP = 1.4;

export function GoalsScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const rows = all(el, ".goal__row");
    const bigs = all(el, ".goal__big");
    const cards = all(el, ".goal__info");
    const n = GOALS.length;

    GOALS.forEach((_, i) => {
      const at = i * STEP;
      const big = bigs[i].querySelectorAll(".mask__in");
      if (i > 0) {
        tl.fromTo(rows[i], { color: "#c9c9c9" }, { color: "#171717", duration: 0.2 }, at)
          .fromTo(rows[i].querySelector(".goal__tick"), { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, at)
          .fromTo(big, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.08, ease: "power3.out" }, at)
          .fromTo(cards[i], { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, at + 0.15);
      }
      if (i < n - 1) {
        tl.to(big, { yPercent: -110, duration: 0.45, stagger: 0.05, ease: "power3.in" }, at + STEP - 0.45)
          .to(cards[i], { opacity: 0, y: -16, duration: 0.3 }, at + STEP - 0.3)
          .to(rows[i], { color: "#a8a8a8", duration: 0.2 }, at + STEP)
          .to(rows[i].querySelector(".goal__tick"), { scaleX: 0, duration: 0.2 }, at + STEP);
      }
    });
    tl.to({}, { duration: 0.8 }, n * STEP);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-haze="0.55" data-label="Goals">
      <div className="stage goal">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_08 Goals</p>

        <ol className="goal__list" data-reveal>
          {GOALS.map((g, i) => (
            <li key={g.t} className="goal__row">
              <span className="eyebrow goal__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="goal__name">{g.t}</span>
              <span className="goal__tick" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="goal__stage">
          {GOALS.map((g) => (
            <div key={g.t} className="goal__big" data-reveal>
              <Mask className="goal__num">{g.n}</Mask>
              <Mask className="eyebrow goal__unit">{g.u}</Mask>
            </div>
          ))}
        </div>

        <div className="goal__cards">
          {GOALS.map((g, i) => (
            <div key={g.t} className="card goal__info" data-reveal>
              <p className="eyebrow eyebrow--muted">Goal {String(i + 1).padStart(2, "0")}</p>
              <h3 className="heading goal__title">{g.t}</h3>
              <p className="body">{g.d}</p>
              <p className="eyebrow goal__howlabel">How</p>
              <ul className="goal__how">{g.how.map((h) => <li key={h}><span className="ok">✓</span> {h}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
