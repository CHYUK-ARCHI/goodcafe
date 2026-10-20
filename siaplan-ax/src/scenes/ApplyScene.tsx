import { useEffect, useRef, useState } from "react";
import { Mask } from "../lib/Mask";
import { useScrollScene } from "../lib/motion";

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

export function ApplyScene() {
  const ref = useRef<HTMLElement>(null);
  const dday = useDday();

  // "지원하기 ↓" 로 바로 도착하는 장면이라 내용은 처음부터 보이게 두고, spectrum 선만 그린다
  useScrollScene(ref, (tl, el) => {
    tl.fromTo(el.querySelector("[data-spec]"), { scaleX: 0.15 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0)
      .to({}, { duration: 0.6 }, 1);
  });

  return (
    <section ref={ref} id="apply" className="scene" style={{ ["--len" as string]: 1.4 }} data-label="Apply">
      <div className="stage apply">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>12 — Apply</p>

        <div className="apply__body">
          <h2 className="display apply__head" data-reveal>
            <Mask>Apply to</Mask>
            <Mask>AI / AX team.</Mask>
          </h2>

          <div className="apply__meta" data-reveal>
            <div className="card apply__deadline">
              <p className="eyebrow eyebrow--muted">Deadline</p>
              <p className="heading-lg apply__date">2026.10.31 <span className="apply__dow">(토)</span></p>
              <p className="eyebrow apply__dday">
                <span className={dday.closed ? "" : "ok"}>●</span> {dday.closed ? "지원이 마감되었습니다" : `${dday.label} · 10월 31일까지 지원 가능`}
              </p>
            </div>
            <div className="card apply__how">
              <p className="eyebrow eyebrow--muted">How to apply</p>
              <p className="body">
                아래 메일 주소로 지원해 주세요.
                <br />
                관심 있는 목표나 해보고 싶은 Task 하나를 함께 적어 주시면 좋습니다.
              </p>
            </div>
          </div>

          <div className="apply__mailbox" data-reveal>
            <a className="apply__email" href={APPLY_MAILTO}>{APPLY_EMAIL}</a>
            <span className="spectrum apply__spectrum" data-spec />
            <div className="apply__ctas">
              <a className="btn btn--fill" href={APPLY_MAILTO}>메일로 지원하기 →</a>
              <a className="btn btn--ghost" href="#top">처음부터 다시 보기 ↑</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
