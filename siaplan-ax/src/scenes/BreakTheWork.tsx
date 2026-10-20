import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { NetLines, type NetLine } from "../lib/NetLines";
import { Pin } from "../lib/Pin";
import { all, useScrollScene } from "../lib/motion";

// [라벨, x%, y%] — 스테이지 기준
const WORDS: [string, number, number][] = [
  ["Site", 14, 30], ["Program", 16, 58], ["Regulation", 38, 22], ["Circulation", 36, 46],
  ["Massing", 60, 30], ["Facade", 62, 56], ["Structure", 84, 26], ["Environment", 84, 50],
  ["Visualization", 30, 80], ["Presentation", 70, 80]
];
const LINKS: [number, number][] = [
  [0, 2], [0, 1], [2, 4], [1, 3], [3, 5], [4, 5], [4, 6], [5, 7], [1, 8], [5, 9], [8, 9], [2, 3], [6, 7], [3, 4]
];
// AI 가 개입하는 하나의 연결 경로 (예: 대지 → 법규 → 매스 → 입면 → 시각화)
const PATH = [0, 2, 4, 5, 9];

const toLine = (a: number, b: number): NetLine => ({ x1: WORDS[a][1], y1: WORDS[a][2], x2: WORDS[b][1], y2: WORDS[b][2] });
const NET: NetLine[] = LINKS.map(([a, b]) => ({ ...toLine(a, b), hair: true }));
const CRIT: NetLine[] = PATH.slice(1).map((b, i) => toLine(PATH[i], b));

export function BreakTheWork() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const pins = all(el, ".break__pin");
    const core = el.querySelector(".break__core .mask__in");

    // 첫 프레임은 "Architecture" 한 단어로 시작한다
    tl.to(core, { yPercent: -110, duration: 0.7, ease: "power3.in" }, 1.6)
      // 하나의 단어가 Task 단위로 분해되어 화면 전체로 흩어진다
      .fromTo(
        pins,
        { x: (i: number) => `${50 - WORDS[i][1]}vw`, y: (i: number) => `${50 - WORDS[i][2]}vh`, scale: 0.4, opacity: 0 },
        { x: 0, y: 0, scale: 1, opacity: 1, duration: 2, stagger: 0.08, ease: "expo.out" },
        1.9
      )
      .fromTo(all(el, ".break__net line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, stagger: 0.1, ease: "power2.out" }, 4.1)
      // 그중 하나의 경로가 AI 워크플로우가 된다
      .fromTo(all(el, ".break__crit line"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, stagger: 0.35, ease: "power2.inOut" }, 6.4)
      .to(PATH.map((i) => pins[i].firstElementChild), { backgroundColor: "#171717", color: "#ffffff", boxShadow: "0 0 0 0px rgba(0,0,0,0)", duration: 0.3, stagger: 0.35 }, 6.4)
      .fromTo(el.querySelector("[data-cap]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 8)
      .to({}, { duration: 1 }, 8.7);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5 }} data-haze="0.22" data-label="Break the work">
      <div className="stage stage--center">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_02 Break the work</p>
        <Mask className="display break__core">Architecture</Mask>
        <div className="break__field" data-reveal>
          <NetLines lines={NET} className="break__net" />
          <NetLines lines={CRIT} className="break__crit" />
          {WORDS.map(([w, x, y]) => (
            <Pin key={w} x={x} y={y} className="chip" pinClass="break__pin">
              {w}
            </Pin>
          ))}
        </div>
        <p className="caption break__cap" data-cap data-reveal>
          <span className="eyebrow">Task network</span>&nbsp;&nbsp;설계는 하나의 일이 아니라 연결된 Task의 네트워크입니다. AI는 그 경로 위에 놓입니다.
        </p>
      </div>
    </section>
  );
}
