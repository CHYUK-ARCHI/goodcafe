import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { all, steps, useScrollScene } from "../lib/motion";
import { APPLY_EMAIL, APPLY_MAILTO } from "./ApplyScene";

const PERKS = [
  {
    n: "01",
    t: "AI 교육",
    d: "AI API와 AI 서비스 활용 교육을 제공합니다. 써보는 것에서 끝나지 않고, 직접 만들 수 있게 합니다.",
    tag: "AI API · AI Service"
  },
  {
    n: "02",
    t: "AI 계정 제공",
    d: "업무와 개발에 필요한 AI 서비스 계정을 팀에서 제공합니다.",
    tag: "Accounts provided"
  },
  {
    n: "03",
    t: "인센티브",
    d: "성과에 따른 인센티브를 추후 제공할 예정입니다.",
    tag: "Coming soon"
  }
];

export function JoinScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    tl.fromTo(all(el, ".join__head .mask__in"), { yPercent: 130 }, { yPercent: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" }, 0.2)
      .fromTo(el.querySelector("[data-sub]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.9)
      .fromTo(all(el, ".join__card"), { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.35, ease: "power3.out" }, 1.4)
      .fromTo(el.querySelector("[data-cta]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 2.9)
      .to({}, { duration: 1.4 }, 3.5);
    steps(tl, [4.9]);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 3.5 }} data-haze="0.42" data-tone="0.25" data-label="Join the team">
      <div className="stage join">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_13 Join the team</p>
        <div className="join__top" data-reveal>
          <h2 className="heading-lg join__head">
            <Mask>Join the</Mask>
            <Mask>AI / AX team.</Mask>
          </h2>
          <p className="body join__sub" data-sub>
            팀에 지원하면 위 목표 중 하나를 맡아 작게 시작합니다.
            <br />
            ONE TASK부터 — 필요한 교육과 도구는 팀이 준비합니다.
          </p>
        </div>
        <ol className="join__grid">
          {PERKS.map((p, i) => (
            <li key={p.n} className={`card join__card${i === 0 ? " card--inverted" : ""}`} data-reveal>
              <p className="eyebrow join__n">
                <span>Perk {p.n}</span>
                <span className={i === 2 ? "join__soon" : ""}>{p.tag}</span>
              </p>
              <h3 className="heading-lg join__title">{p.t}</h3>
              <p className="body join__desc">{p.d}</p>
            </li>
          ))}
        </ol>
        <p className="eyebrow join__cta" data-cta data-reveal>
          지원 · 문의 — <a className="join__mail" href={APPLY_MAILTO}>{APPLY_EMAIL}</a> · 10월 31일까지
        </p>
      </div>
    </section>
  );
}
