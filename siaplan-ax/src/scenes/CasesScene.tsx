import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { NameMark } from "../lib/NameMark";
import { CASES, STATUS_LABEL } from "../lib/cases";
import { all, steps, useScrollScene } from "../lib/motion";

const IN = 0.9; // 카드가 다 들어온 시점 = 첫 멈춤
const STEP = 1;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * 다른 회사 사례. 인스타그램 피드처럼 생긴 사례 카드가 가로로 흐르고,
 * 한 번 스크롤할 때마다 다음 사례가 앞으로 온다 (트랙 이동은 CSS 변수 --i 하나로).
 */
export function CasesScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const track = el.querySelector<HTMLElement>(".cases__track")!;
    const posts = all(el, ".post");
    const dots = all(el, ".cases__dot");
    const n = CASES.length;
    const ink = "#171717";
    const ash = "#c9c9c9";

    tl.fromTo(posts, { opacity: 0, x: 80 }, { opacity: (j) => (j === 0 ? 1 : 0.42), x: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0)
      .fromTo(dots, { backgroundColor: ash }, { backgroundColor: (j) => (j === 0 ? ink : ash), duration: 0.2 }, 0.4);

    for (let k = 1; k < n; k++) {
      const at = IN + (k - 1) * STEP + 0.2;
      tl.fromTo(track, { "--i": k - 1 }, { "--i": k, duration: 0.7, ease: "power2.inOut" }, at)
        .to(posts, { opacity: (j) => (j === k ? 1 : 0.42), duration: 0.5 }, at + 0.1)
        .to(dots, { backgroundColor: (j) => (j === k ? ink : ash), duration: 0.2 }, at + 0.2);
    }
    tl.to({}, { duration: 0.6 }, IN + (n - 1) * STEP + 0.2);
    steps(tl, CASES.map((_, k) => (k === 0 ? IN : IN + (k - 1) * STEP + 1)));
  });

  const large = CASES.filter((c) => c.tier === "Large").length;

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-haze="0.28" data-tone="0.15" data-label="Cases">
      <div className="stage cases">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_02 Cases</p>

        <header className="cases__head" data-reveal>
          <h2 className="poster cases__title">
            <Mask>Others are</Mask>
            <Mask>already</Mask>
            <Mask>moving.</Mask>
          </h2>
          <p className="cases__ko" lang="ko">
            대형 사무소는 전담 조직과 자체 도구로,<br />
            작은 사무소는 작은 팀과 파이프라인으로 움직이고 있습니다.
          </p>
          <p className="cases__legend eyebrow eyebrow--muted" aria-hidden="true">
            <span>Large</span>
            {CASES.map((c, i) => (
              <span key={c.id} className={`cases__dot${i === large ? " cases__dot--gap" : ""}`} />
            ))}
            <span>Small</span>
          </p>
        </header>

        <div className="cases__view">
          <ol className="cases__track" style={{ ["--n" as string]: CASES.length }}>
            {CASES.map((c, i) => (
              <li key={c.id} className="post" data-reveal>
                <header className="post__head">
                  <NameMark c={c} />
                  <span className="post__who">
                    <b>{c.name}</b>
                    <small>{c.tier === "Large" ? "Large firm" : "Small firm"} · Case {pad(i + 1)}</small>
                  </span>
                  <span className="post__more" aria-hidden="true">···</span>
                </header>

                <div className="post__img" aria-hidden="true">
                  <span className="eyebrow post__kick">siaplan.ax / case {pad(i + 1)}</span>
                  <span className={`post__wm${/[가-힣]/.test(c.mark) ? " post__wm--ko" : ""}`}>{c.mark}</span>
                  <p className="poster post__big">{c.big}</p>
                  <p className="post__sub">{c.sub}</p>
                  <ol className="post__flow">
                    {c.flow.map((f) => <li key={f}>{f}</li>)}
                  </ol>
                </div>

                <div className="post__actions">
                  <span aria-hidden="true">♡ ◯ ↗</span>
                  <span className={`post__status post__status--${c.status}`}>{STATUS_LABEL[c.status]}</span>
                </div>

                <div className="post__cap">
                  <p className="post__title"><b>{c.name}</b> {c.title}</p>
                  <ol className="post__how">{c.how.map((h) => <li key={h}>{h}</li>)}</ol>
                  <p className="post__tags">{c.tags.join(" ")}</p>
                  <p className="post__src">
                    <span className="eyebrow eyebrow--muted">Source</span>
                    {c.sources.map((s) => (
                      <a key={s.url} href={s.url} target="_blank" rel="noreferrer">{s.label} ↗</a>
                    ))}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="cases__note" data-reveal lang="ko">
          SIAPLAN AI/AX 가 공개 보도·회사 발표를 바탕으로 재구성한 사례 카드입니다. 각 회사의 공식 게시물·로고가 아니며, 수치는 출처 기준입니다.
        </p>
      </div>
    </section>
  );
}
