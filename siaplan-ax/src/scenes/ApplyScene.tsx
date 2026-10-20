import { useEffect, useRef, useState } from "react";
import { Mask } from "../lib/Mask";
import { POSTER_LINES, POSTER_TAGLINE, SPIRIT } from "../lib/posterCopy";
import { steps, useScrollScene } from "../lib/motion";

export const APPLY_EMAIL = "career@siaplan.com";
export const APPLY_MAILTO = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent("[SIAPLAN AI/AX] 팀 지원")}`;
// 마감: 2026-10-31(토) 23:59 KST
const DEADLINE = new Date("2026-10-31T23:59:59+09:00");
const DAY = 24 * 60 * 60 * 1000;

function useDday() {
  const calc = () => {
    const left = DEADLINE.getTime() - Date.now();
    if (left < 0) return { closed: true, label: "마감" };
    const days = Math.floor(left / DAY);
    return { closed: false, label: days === 0 ? "D-DAY" : `D-${days}` };
  };
  const [d, setD] = useState(calc);
  useEffect(() => {
    const id = window.setInterval(() => setD(calc()), 60 * 1000);
    return () => window.clearInterval(id);
  }, []);
  return d;
}

/** 마지막 장면 = 웹으로 옮긴 지원 포스터. "지원하기 ↓" 로 바로 도착하므로 처음부터 완성된 구도로 보인다. */
export function ApplyScene() {
  const ref = useRef<HTMLElement>(null);
  const dday = useDday();

  useScrollScene(ref, (tl, el) => {
    // 아주 약한 패럴랙스만: 큰 타이틀이 조금 올라가고 정보 블록이 따라온다
    tl.fromTo(el.querySelector(".apply__center"), { y: 0 }, { y: -24, duration: 1 }, 0)
      .fromTo(el.querySelector(".apply__info"), { y: 0 }, { y: -12, duration: 1 }, 0);
    steps(tl, [0]);
  });

  return (
    <section ref={ref} id="apply" className="scene" style={{ ["--len" as string]: 1.4 }} data-haze="0.65" data-tone="0" data-label="Apply">
      <div className="stage apply">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_13 Apply</p>

        <p className="poster-sm apply__corner" data-reveal>SIAPLAN<br />AI/AX TEAM TF<br />APPLY</p>

        <div className="apply__center" data-reveal>
          <h2 className="poster apply__title">
            <Mask>SIA</Mask>
            <Mask>AI/AX</Mask>
            <Mask>TF</Mask>
          </h2>
          <ul className="underscore apply__lines">
            {POSTER_LINES.map((l) => <li key={l}>{l}</li>)}
          </ul>
        </div>

        <div className="apply__info" data-reveal>
          <p className="poster-sm apply__block">
            ~10/31
            <br />
            Siaplan
            <br />
            <a className="apply__email" href={APPLY_MAILTO}>{APPLY_EMAIL}</a>
          </p>
          <p className="eyebrow apply__dday">
            <span className={dday.closed ? "" : "ok"}>●</span>{" "}
            {dday.closed ? "지원이 마감되었습니다" : `${dday.label} · 2026.10.31 (토) 23:59 마감`}
          </p>
          <div className="apply__ctas">
            <a className="btn btn--fill" href={APPLY_MAILTO}>메일로 지원하기 →</a>
            <a className="btn btn--ghost" href="#top">처음부터 ↑</a>
          </div>
          <p className="tagline apply__tag">
            {POSTER_TAGLINE.map((t) => <span key={t}>{t}<br /></span>)}
          </p>
        </div>

        <aside className="apply__spirit" data-reveal aria-label={SPIRIT.title}>
          <p className="eyebrow">_{SPIRIT.title}</p>
          <p className="apply__spiritko">{SPIRIT.ko}</p>
          <blockquote className="apply__quote">
            <p>“{SPIRIT.quote}”</p>
            <cite>— {SPIRIT.cite}</cite>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}
