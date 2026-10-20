// 지금의 문제의식 (팀 정의) — Problem 장면과 Workflow 장면이 같이 쓴다
export const PROBLEMS = [
  { id: "P01", tag: "Information", en: ["Information is", "hard to find."], ko: "자료를 찾기 어렵습니다.", goal: "SID-DB" },
  { id: "P02", tag: "Regulation", en: ["Regulation review", "has no system."], ko: "법규검토의 체계화가 이루어져 있지 않습니다.", goal: "Legal CAD · 규모검토·법규 3일" },
  { id: "P03", tag: "Sharing", en: ["Work is inefficient,", "with no shared system."], ko: "업무는 비효율적이고, 공유 시스템이 없습니다.", goal: "SIA Studio · SIAPLAN Add-on" },
  { id: "P04", tag: "Communication", en: ["Communication has", "no clear line."], ko: "커뮤니케이션과 소통 라인이 없습니다.", goal: "PMS 연동 · SIA Studio" }
] as const;

export type ProblemId = (typeof PROBLEMS)[number]["id"];
