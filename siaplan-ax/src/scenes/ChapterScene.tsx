import { useRef } from "react";
import { Hl } from "../lib/Hl";
import type { Chapter, Timeline } from "../lib/chapters";
import { all, steps, useScrollScene } from "../lib/motion";

const GROUP = 1; // 스텝 하나의 길이
const FIRST = 0.3; // 첫 묶음이 들어오는 시점
const pad = (n: number) => String(n).padStart(2, "0");

// 형광펜을 왼쪽에서 오른쪽으로 긋는다
const draw = (tl: gsap.core.Timeline, marks: Element[], at: number) => {
  if (marks.length) tl.fromTo(marks, { backgroundSize: "0% 0.62em" }, { backgroundSize: "100% 0.62em", duration: 0.45, stagger: 0.1, ease: "power2.out" }, at);
};

/**
 * 장(chapter) 하나 = 제목 + 번호 붙은 줄 + 결론 한 줄.
 * 스크롤 한 번에 한 묶음씩 줄이 들어오고, 그 줄의 강조 문구에 형광펜이 그어진다.
 */
export function ChapterScene({ ch }: { ch: Chapter }) {
  const ref = useRef<HTMLElement>(null);
  const len = 1.4 + ch.groups.length * 0.9 + (ch.takeaway ? 0.7 : 0);

  useScrollScene(ref, (tl, el) => {
    const items = all(el, ".ch__item");
    draw(tl, all(el, ".ch__title .hl"), 0);

    let i = 0;
    const stops: number[] = [];
    const t = ch.timeline;
    const line = el.querySelector(".tl__line");
    ch.groups.forEach((n, g) => {
      const at = FIRST + g * GROUP;
      // 타임라인이 있으면 그 단계의 막대 · 달 · 일을, 없으면 번호 줄 묶음을 들인다
      const group = t ? all(el, `.tl [data-g="${g}"]`) : items.slice(i, i + n);
      i += n;
      tl.fromTo(group, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, at);
      if (t && line) {
        const reach = (k: number) => (k < 0 ? 0 : (t.phases[k].to + 1) / t.months.length);
        tl.fromTo(line, { scaleX: reach(g - 1) }, { scaleX: reach(g), duration: 0.6, ease: "power2.inOut" }, at);
        tl.fromTo(el.querySelector(`.tl__phase[data-g="${g}"] .tl__bar`), { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, at + 0.1);
      }
      draw(tl, group.flatMap((it) => Array.from(it.querySelectorAll(".hl"))), at + 0.3);
      stops.push(at + 0.8);
    });

    const end = FIRST + ch.groups.length * GROUP;
    const take = el.querySelector(".ch__take");
    if (take) {
      tl.fromTo(take, { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 0.5, ease: "power3.out" }, end);
      stops.push(end + 0.6);
    }
    tl.to({}, { duration: 0.5 }, stops[stops.length - 1]);
    steps(tl, stops);
  });

  return (
    <section
      ref={ref}
      id={ch.id}
      className="scene"
      style={{ ["--len" as string]: len }}
      data-haze={ch.haze}
      data-tone={ch.tone}
      data-label={ch.label}
    >
      <div className={`stage ch ch--${ch.layout}${ch.items.length > 4 ? " ch--dense" : ""}${ch.timeline ? " ch--timeline" : ""}`}>
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>{ch.kicker}</p>
        <h2 className="ch__title" data-reveal><Hl text={ch.title} /></h2>
        {ch.lede && <p className="ch__lede" data-reveal>{ch.lede}</p>}

        <ol className="ch__list">
          {ch.items.map((it, k) => (
            <li key={it.head} className="ch__item" data-reveal>
              <span className="ch__n">{pad(k + 1)}</span>
              <div className="ch__head">
                <p className="ch__h">{it.pick ? <mark className="hl">{it.head}</mark> : it.head}</p>
                {it.meta && <p className="ch__meta">{it.meta}</p>}
              </div>
              {ch.layout === "pairs" && <span className="ch__arrow" aria-hidden="true">→</span>}
              {ch.layout === "pairs" ? (
                <div className="ch__pair">
                  {it.big && <p className="ch__big">{it.big}</p>}
                  <p className="ch__body"><Hl text={it.body} /></p>
                </div>
              ) : (
                <>
                  {it.big && <p className="ch__big">{it.pick ? <mark className="hl">{it.big}</mark> : it.big}</p>}
                  <p className="ch__body"><Hl text={it.body} /></p>
                </>
              )}
            </li>
          ))}
        </ol>

        {ch.timeline && <TimelineView t={ch.timeline} />}

        {ch.note && <p className="ch__note" data-reveal>{ch.note}</p>}
        {ch.takeaway && <p className="ch__take" data-reveal>{ch.takeaway}</p>}
      </div>
    </section>
  );
}

/**
 * 일정 타임라인 (데스크톱). 위: 단계 막대 / 가운데: 달 눈금 / 아래: 그 달의 일.
 * 모바일 · reduced-motion 에서는 같은 내용을 번호 줄(ch__list)로 보여준다.
 */
function TimelineView({ t }: { t: Timeline }) {
  const phaseOf = (m: number) => t.phases.findIndex((p) => m >= p.from && m <= p.to);
  const span = (from: number, to = from) => ({ gridColumn: `${from + 1} / ${to + 2}` });
  return (
    <div className="tl" style={{ ["--n" as string]: t.months.length }} aria-label="6개월 일정">
      {t.phases.map((p, k) => (
        <div key={p.name} className="tl__phase" data-g={k} style={span(p.from, p.to)}>
          <p className="tl__pname">{p.name}</p>
          <p className="tl__pmeta">{p.meta}</p>
          <span className="tl__bar" aria-hidden="true" />
        </div>
      ))}
      <div className="tl__axis" aria-hidden="true"><span className="tl__line" /></div>
      {t.months.map((mo, k) => (
        <div key={mo.m} className="tl__month" data-g={phaseOf(k)} style={span(k)}>
          <span className="tl__dot" aria-hidden="true" />
          <b>{mo.m}</b>
          {mo.y && <small>{mo.y}</small>}
        </div>
      ))}
      {t.events.map((e) => (
        <ul key={e.at} className="tl__ev" data-g={phaseOf(e.at)} style={span(e.at, e.to)}>
          {e.text.map((x) => <li key={x}><Hl text={x} /></li>)}
        </ul>
      ))}
    </div>
  );
}
