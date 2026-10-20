import { useRef } from "react";
import { Mask } from "../lib/Mask";
import { PROBLEMS, type ProblemId } from "../lib/problems";
import { all, steps, useScrollScene } from "../lib/motion";

// 6단계 AI 워크플로우로 네 가지 문제(P01–P04)를 푸는 방법
const STEPS: { t: string; q: string; en: string; ko: string; log: string; fix: ProblemId[] }[] = [
  {
    t: "Define",
    q: "Name the four problems.",
    en: "Finding information, regulation review, sharing and communication — each becomes a measurable goal.",
    ko: "네 가지 문제를 정확히 정의합니다. 자료 찾기, 법규 검토, 업무 공유, 소통을 각각 측정할 수 있는 목표로 바꿉니다.",
    log: "4개 문제 → 측정 가능한 목표",
    fix: ["P01", "P02", "P03", "P04"]
  },
  {
    t: "Decompose",
    q: "Break each problem into tasks.",
    en: "Collect, classify, search · check clauses · share, version · request, decide, record — small tasks where AI can step in.",
    ko: "문제를 Task로 쪼갭니다. 수집·분류·검색, 조항 확인, 공유·버전 관리, 요청·결정·기록처럼 AI가 들어갈 수 있는 작은 단위로 나눕니다.",
    log: "문제별 Task 분해 · AI 개입 지점 표시",
    fix: ["P01", "P02", "P03", "P04"]
  },
  {
    t: "Context",
    q: "Connect the right context.",
    en: "References and past projects to SID-DB, codes and ordinances to a regulation base, schedules and owners to PMS.",
    ko: "맥락을 연결합니다. 참고자료와 지난 프로젝트는 SID-DB로, 법규·조례는 법규 DB로, 일정과 담당자는 PMS로 이어 붙입니다.",
    log: "SID-DB · 법규 DB · PMS 연결",
    fix: ["P01", "P02", "P04"]
  },
  {
    t: "Generate",
    q: "Let AI draft first.",
    en: "Search results, regulation checklists and review drafts, meeting notes and requests — in minutes, not days.",
    ko: "AI가 먼저 초안을 만듭니다. 자료 검색 결과, 법규 체크리스트와 검토서 초안, 회의록과 요청 정리를 며칠이 아니라 몇 분 안에.",
    log: "검색 결과 · 법규 검토 초안 · 회의록 정리",
    fix: ["P01", "P02", "P04"]
  },
  {
    t: "Evaluate",
    q: "People check, criteria decide.",
    en: "Architects verify every regulation item; a shared checklist catches omissions before they reach the drawings.",
    ko: "사람이 확인하고 기준이 판단합니다. 법규 항목은 건축가가 최종 검증하고, 공용 체크리스트로 도면에 들어가기 전에 누락을 잡습니다.",
    log: "건축가 최종 검증 · 체크리스트로 누락 확인",
    fix: ["P02", "P03"]
  },
  {
    t: "Iterate",
    q: "Share it, then standardize.",
    en: "Verified results become SIA Studio templates, shared through PMS and reused on the next project.",
    ko: "공유하고 표준으로 만듭니다. 검증된 결과는 SIA Studio 템플릿이 되고, PMS로 공유되어 다음 프로젝트에서 다시 쓰입니다.",
    log: "SIA Studio 템플릿 · PMS 공유 · 재사용",
    fix: ["P03", "P04"]
  }
];
const STEP = 1.3;
const TAG = Object.fromEntries(PROBLEMS.map((p) => [p.id, p.tag]));

export function WorkflowScene() {
  const ref = useRef<HTMLElement>(null);

  useScrollScene(ref, (tl, el) => {
    const items = all(el, ".wf__item");
    const titles = all(el, ".wf__title");
    const kos = all(el, ".wf__kos .wf__ko");
    const lines = all(el, ".cli__line");

    STEPS.forEach((_, i) => {
      const at = i * STEP;
      const t = titles[i].querySelectorAll(".mask__in");
      const meta = titles[i].querySelectorAll("[data-meta]");
      // 첫 단계는 장면 시작부터 보이도록 등장 트윈을 건너뛴다 (CSS :first-child 가 활성 상태)
      if (i > 0) {
        tl.fromTo(items[i], { color: "#c9c9c9" }, { color: "#171717", duration: 0.2 }, at)
          .fromTo(items[i].querySelector(".wf__tick"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out" }, at)
          .fromTo(t, { yPercent: 130 }, { yPercent: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }, at)
          .fromTo(meta, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.2)
          .fromTo(kos[i], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.25)
          .fromTo([lines[i * 2], lines[i * 2 + 1]], { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.25, stagger: 0.2 }, at + 0.15);
      }
      if (i < STEPS.length - 1) {
        tl.to(t, { yPercent: -130, duration: 0.45, stagger: 0.05, ease: "power3.in" }, at + STEP - 0.45)
          .to(meta, { opacity: 0, duration: 0.25 }, at + STEP - 0.45)
          .to(kos[i], { opacity: 0, duration: 0.25 }, at + STEP - 0.45)
          .to(items[i], { color: "#a8a8a8", duration: 0.2 }, at + STEP)
          .to(items[i].querySelector(".wf__tick"), { scaleX: 0, duration: 0.2 }, at + STEP);
      }
    });
    tl.to({}, { duration: 0.8 }, STEPS.length * STEP);
    steps(tl, [0, 1.9, 3.2, 4.5, 5.8, 8.6]);
  });

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 6 }} data-haze="0.2" data-tone="0.25" data-label="The new workflow">
      <div className="stage wf">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_04 The new workflow</p>

        <ol className="wf__list" data-reveal>
          {STEPS.map((s, i) => (
            <li key={s.t} className="wf__item">
              <span className="eyebrow wf__idx">{String(i + 1).padStart(2, "0")}</span>
              <span className="heading wf__name">{s.t}</span>
              <span className="wf__tick" aria-hidden="true" />
            </li>
          ))}
        </ol>

        <div className="wf__stage">
          {STEPS.map((s, i) => (
            <div key={s.t} className="wf__title" data-reveal>
              <Mask className="eyebrow eyebrow--muted">{`Step ${String(i + 1).padStart(2, "0")} / 06`}</Mask>
              <Mask className="display">{s.t}</Mask>
              <Mask className="heading wf__q">{s.q}</Mask>
              <p className="body wf__en" data-meta>{s.en}</p>
              <p className="wf__fix" data-meta>
                <span className="eyebrow eyebrow--muted">Solves</span>
                {s.fix.map((id) => (
                  <span key={id} className="chip chip--ghost wf__chip">{id} {TAG[id]}</span>
                ))}
              </p>
              <p className="wf__ko wf__ko--inline" lang="ko">{s.ko}</p>
            </div>
          ))}
        </div>

        <div className="wf__kos" aria-hidden="true">
          {STEPS.map((s) => <p key={s.t} className="wf__ko" lang="ko">{s.ko}</p>)}
        </div>

        <div className="card cli" data-reveal>
          <div className="cli__bar">
            <span className="eyebrow eyebrow--muted">workflow.log</span>
            <span className="cli__dots" aria-hidden="true"><i /><i /><i /></span>
          </div>
          <ul className="cli__body">
            {STEPS.flatMap((s) => [
              <li key={`${s.t}c`} className="cli__line"><span className="glyph">×</span> {s.t.toLowerCase()} — {s.fix.join(" ")}</li>,
              <li key={`${s.t}o`} className="cli__line cli__line--out"><span className="ok">✓</span> {s.log}</li>
            ])}
          </ul>
        </div>
      </div>
    </section>
  );
}
