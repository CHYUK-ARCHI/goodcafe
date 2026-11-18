import { useRef } from "react";
import { all, steps, useScrollScene } from "../lib/motion";

// 각자 만든 프로그램 → 공유 플랫폼 → 모두의 도구
const MAKERS = [
  { name: "법규검토 자동화", cat: "법규 · 기술검토" },
  { name: "규모검토 스크립트", cat: "자동화 프로그램" },
  { name: "보고서 템플릿", cat: "문서 · 보고서" },
  { name: "렌더링 워크플로우", cat: "이미지 · 시각화" },
  { name: "BIM 표준 레이어", cat: "설계 · BIM" },
  { name: "프롬프트 모음", cat: "AI 활용팁" }
];
const USERS = ["현상설계", "계획설계", "실시설계", "PM · 보고", "신규 입사자"];

/* ---- 데스크톱 도면 (viewBox 1200 × 520) ---- */
const W = 1200;
const CARD = { w: 290, h: 64 };
const HUB = { x: 470, y: 170, w: 260, h: 180 };
const HUB_CY = HUB.y + HUB.h / 2;
const RX = W - CARD.w; // 오른쪽 카드 x
const leftY = (i: number) => 12 + i * 84;
const rightY = (i: number) => 54 + i * 90;
const inPath = (i: number) => {
  const y = leftY(i) + CARD.h / 2;
  return `M${CARD.w},${y} C${CARD.w + 110},${y} ${HUB.x - 110},${HUB_CY} ${HUB.x},${HUB_CY}`;
};
const outPath = (i: number) => {
  const y = rightY(i) + CARD.h / 2;
  const x0 = HUB.x + HUB.w;
  return `M${x0},${HUB_CY} C${x0 + 110},${HUB_CY} ${RX - 110},${y} ${RX},${y}`;
};

/* ---- 모바일 도면 (viewBox 400 × 860): 위 → 가운데 → 아래 ---- */
const M = { w: 186, h: 52, gap: 28 };
const MHUB = { x: 70, y: 350, w: 260, h: 120 };
const mCol = (i: number) => (i % 2 ? 400 - M.w : 0);
const mTopY = (i: number) => Math.floor(i / 2) * (M.h + 18);
const mBotY = (i: number) => 620 + Math.floor(i / 2) * (M.h + 18);
const mIn = (i: number) => {
  const x = mCol(i) + M.w / 2, y = mTopY(i) + M.h;
  return `M${x},${y} C${x},${y + 80} 200,${MHUB.y - 80} 200,${MHUB.y}`;
};
const mOut = (i: number) => {
  const x = (i === 4 ? 200 - M.w / 2 : mCol(i)) + M.w / 2, y = mBotY(i);
  return `M200,${MHUB.y + MHUB.h} C200,${MHUB.y + MHUB.h + 80} ${x},${y - 80} ${x},${y}`;
};

/** 흐르는 점: 경로를 따라 계속 움직인다 (스크롤과 무관) */
function Packets({ d, delay, dur = 3.2 }: { d: string; delay: number; dur?: number }) {
  return (
    <>
      <path className="share__wire" d={d} />
      <path className="share__flow" d={d} />
      {[0, dur / 2].map((o) => (
        <circle key={o} className="share__dot" r="5">
          <animateMotion dur={`${dur}s`} begin={`${-(delay + o)}s`} repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
        </circle>
      ))}
    </>
  );
}

/**
 * 각자 만든 프로그램을 공유 플랫폼에 올리면, 모든 팀이 같은 도구를 쓴다.
 * 스크롤 세 번: ① 각자 만든 것 ② 플랫폼으로 모임 ③ 모두에게 퍼짐. 점은 그 뒤로 계속 흐른다.
 */
export function SharingScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const g = (k: number) => all(el, `.share__d [data-g="${k}"]`);
    tl.fromTo(g(0), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, 0.3)
      .fromTo(g(1), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.04 }, 1.3)
      .fromTo(g(2), { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.06, ease: "power3.out" }, 2.3)
      .fromTo(all(el, "[data-step]"), { opacity: 0.25 }, { opacity: 1, duration: 0.3, stagger: 1 }, 0.3)
      .to({}, { duration: 0.5 }, 3.1);
    steps(tl, [1.1, 2.1, 3.1]);
  });

  return (
    <section ref={ref} id="sharing" className="scene" style={{ ["--len" as string]: 4 }} data-haze="0.34" data-tone="0.1" data-label="How we share">
      <div className="stage ch share">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_03 How we share</p>
        <h2 className="ch__title" data-reveal>각자 만든 프로그램을,<br /><b className="em">모두의 도구</b>로</h2>
        <ol className="share__steps" data-reveal>
          <li data-step><span>01</span> 각자 만들고</li>
          <li data-step><span>02</span> 플랫폼에 올리면</li>
          <li data-step><span>03</span> 모든 팀이 씁니다</li>
        </ol>

        {/* 데스크톱 */}
        <svg className="share__d share__d--wide" viewBox={`0 0 ${W} 520`} role="img" aria-label="각자 만든 프로그램 6가지가 SIA 공유 플랫폼으로 모이고, 다섯 갈래의 팀으로 퍼지는 그림">
          <g data-g="1">{MAKERS.map((_, i) => <Packets key={i} d={inPath(i)} delay={i * 0.45} />)}</g>
          <g data-g="2">{USERS.map((_, i) => <Packets key={i} d={outPath(i)} delay={1.6 + i * 0.5} />)}</g>

          {MAKERS.map((m, i) => (
            <g key={m.name} transform={`translate(0 ${leftY(i)})`}>
              <g data-g="0">
                <rect className="share__card" width={CARD.w} height={CARD.h} rx="6" />
                <text className="share__name" x="18" y="28">{m.name}</text>
                <text className="share__cat" x="18" y="52">{m.cat}</text>
              </g>
            </g>
          ))}

          <g data-g="1">
            <rect className="share__pulse" x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="10" />
            <rect className="share__hub" x={HUB.x} y={HUB.y} width={HUB.w} height={HUB.h} rx="10" />
            <text className="share__hubk" x={HUB.x + 24} y={HUB.y + 40}>SIA</text>
            <text className="share__hubt" x={HUB.x + 24} y={HUB.y + 82}>공유 플랫폼</text>
            <text className="share__hubs" x={HUB.x + 24} y={HUB.y + 124}>올리기 · 검증 · 버전 관리</text>
            <text className="share__hubs" x={HUB.x + 24} y={HUB.y + 150}>사용법 · 개선 사례</text>
          </g>

          {USERS.map((u, i) => (
            <g key={u} transform={`translate(${RX} ${rightY(i)})`}>
              <g data-g="2">
                <rect className="share__card share__card--use" width={CARD.w} height={CARD.h} rx="6" />
                <text className="share__name" x="18" y="39">{u}</text>
                <text className="share__cat" x={CARD.w - 18} y="39" textAnchor="end">같은 도구로</text>
              </g>
            </g>
          ))}

          <text className="share__label" x="0" y="512">각자 만든 것</text>
          <text className="share__label" x={W} y="512" textAnchor="end">모두의 도구</text>
        </svg>

        {/* 모바일 */}
        <svg className="share__d share__d--tall" viewBox="0 0 400 860" role="img" aria-label="각자 만든 프로그램 6가지가 SIA 공유 플랫폼으로 모이고, 다섯 갈래의 팀으로 퍼지는 그림">
          <g data-g="1">{MAKERS.map((_, i) => <Packets key={i} d={mIn(i)} delay={i * 0.4} dur={2.6} />)}</g>
          <g data-g="2">{USERS.map((_, i) => <Packets key={i} d={mOut(i)} delay={1.3 + i * 0.4} dur={2.6} />)}</g>
          {MAKERS.map((m, i) => (
            <g key={m.name} transform={`translate(${mCol(i)} ${mTopY(i)})`}>
              <g data-g="0">
                <rect className="share__card" width={M.w} height={M.h} rx="6" />
                <text className="share__name share__name--m" x="14" y="32">{m.name}</text>
              </g>
            </g>
          ))}
          <g data-g="1">
            <rect className="share__hub" x={MHUB.x} y={MHUB.y} width={MHUB.w} height={MHUB.h} rx="10" />
            <text className="share__hubt" x="200" y={MHUB.y + 56} textAnchor="middle">SIA 공유 플랫폼</text>
            <text className="share__hubs" x="200" y={MHUB.y + 88} textAnchor="middle">올리기 · 검증 · 버전 관리</text>
          </g>
          {USERS.map((u, i) => (
            <g key={u} transform={`translate(${i === 4 ? 200 - M.w / 2 : mCol(i)} ${mBotY(i)})`}>
              <g data-g="2">
                <rect className="share__card share__card--use" width={M.w} height={M.h} rx="6" />
                <text className="share__name share__name--m" x="14" y="32">{u}</text>
              </g>
            </g>
          ))}
        </svg>

        <p className="ch__take" data-reveal>한 사람이 만든 도구가, 모든 프로젝트의 시간을 줄입니다</p>
      </div>
    </section>
  );
}
