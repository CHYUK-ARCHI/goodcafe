/**
 * From AI to AX : SID_E STEP — 장(chapter) 데이터.
 * 「2611117_AIAX-2」 보고서를 축약한 것 (비용 · 문제점 · 다른 회사 사례 페이지는 넣지 않는다).
 *
 * 문자열 안의 ==강조== 는 형광펜 표시, \n 은 줄바꿈 (lib/Hl.tsx).
 */
export type Item = {
  head: string; // 굵은 머리말
  meta?: string; // 머리말 아래 작은 글씨
  big?: string; // 큰 숫자 · 키워드
  body: string; // 설명
  pick?: boolean; // 형광펜으로 한 줄 전체 강조
};

/** 일정 타임라인: 월 칸 위에 단계 막대, 아래에 그 달의 일. at/to 는 months 의 인덱스. */
export type Timeline = {
  months: { m: string; y?: string }[];
  phases: { name: string; meta: string; from: number; to: number }[];
  events: { at: number; to?: number; text: string[] }[];
};

export type Chapter = {
  id: string;
  label: string; // 장면 바 · 내비 이름
  kicker: string;
  title: string;
  lede?: string;
  layout: "statements" | "grid" | "rows" | "pairs" | "phases";
  timeline?: Timeline;
  items: Item[];
  groups: number[]; // 한 스텝에 들어오는 항목 수
  takeaway?: string;
  note?: string;
  haze: number;
  tone: number;
};

export const CHAPTERS: Chapter[] = [
  {
    id: "why",
    label: "Why",
    kicker: "_01 Why",
    title: "개인의 AI 활용에서\n==조직의 AX 혁신==으로",
    lede: "AI 를 쓰는 사람은 이미 많습니다. 이제 그 경험을 조직이 함께 쓰는 단계입니다.",
    layout: "statements",
    items: [
      { head: "경험을 모읍니다", body: "개인별로 쌓인 AI 기술과 노하우를 ==조직 차원에서 공유==합니다." },
      { head: "계속 업데이트합니다", body: "AI 기술과 활용 방식은 빠르게 바뀝니다. ==지속적인 정보 공유==로 함께 따라갑니다." }
    ],
    groups: [1, 1],
    takeaway: "자율적 AI 경험 공유, 업무효율 향상",
    haze: 0.4,
    tone: 0
  },
  {
    id: "share",
    label: "What we share",
    kicker: "_02 What we share",
    title: "실무에 바로 쓰는\n==사내 AI 공유체계==",
    lede: "실무 적용을 넓히고 업무효율을 높이기 위해, 여섯 갈래로 경험을 모읍니다.",
    layout: "grid",
    items: [
      { head: "법규 · 기술검토", body: "법규 검색, 인허가 검토, 공법 비교" },
      { head: "문서 · 보고서", body: "보고서, 회의록, 공정보고" },
      { head: "이미지 · 시각화", body: "조감도, 투시도, 렌더링, 동영상" },
      { head: "설계 · BIM", body: "모델링, 도면 작성, 표준 레이어 생성" },
      { head: "자동화 프로그램", body: "CAD · BIM 스크립트, 규모검토 자동화" },
      { head: "AI 활용팁", body: "프롬프트, 신규 AI 툴, 실패와 개선 사례" }
    ],
    groups: [2, 2, 2],
    haze: 0.3,
    tone: 0
  },
  {
    id: "direction",
    label: "Our direction",
    kicker: "_03 Our direction",
    title: "SIAPLAN 이 가는\n==세 가지 방향==",
    layout: "pairs",
    items: [
      { head: "전담 조직이 먼저", meta: "사내 AI TF", big: "자체 공유 플랫폼 구축", body: "내부 공유와 커뮤니티 활성화로 ==업무 효율==을 높입니다." },
      { head: "사내 데이터 구조화 · 확산", meta: "TF → 전사", big: "AI 친화적 사내문화", body: "전체 기술을 높이고 ==직원 누구나 개발==할 수 있게 합니다." },
      { head: "반복 업무부터 자동화", meta: "시스템 구축 후 확장", big: "파일럿 프로젝트 적용", body: "경험과 데이터로 ==AI 수주, 공모전 · 제안서 제작 자동화 파이프라인==을 만듭니다." }
    ],
    groups: [1, 1, 1],
    takeaway: "자율적 AI 경험 공유, 업무효율 향상 및 추후 확장",
    haze: 0.42,
    tone: 0.35
  },
  {
    id: "now",
    label: "In progress",
    kicker: "_04 In progress",
    title: "이미 ==시작한 것==들",
    lede: "지금 진행 중인 자동화 제작 현황과 진행형 프로젝트입니다.",
    layout: "rows",
    items: [
      { head: "법규 · 기술검토", meta: "자동 법규검토, 인허가 기준", big: "적용 중", body: "검토 단계" },
      { head: "문서 · 보고서", meta: "보고서 규격화, 회의록", big: "적용 중", body: "검토 · 제안 단계" },
      { head: "이미지 · 시각화", meta: "렌더링 · 동영상 워크플로우", big: "적용 중", body: "검토부터 실무 설계까지 전 단계" },
      { head: "자동화 프로그램", meta: "법규 · 규모검토 자동화", big: "적용 중", body: "검토 · 제안 단계" },
      { head: "AI 활용팁", meta: "공유 플랫폼, 아이디어 공작소", big: "초기 개발", body: "초기 아이디어 개발" },
      { head: "설계 · BIM", meta: "BIM 규격화, 모델링 자동화", big: "계획", body: "제안 · 현상 설계부터 적용 예정" }
    ],
    groups: [3, 3],
    takeaway: "추후 아이디어로 계속 확장",
    haze: 0.3,
    tone: 0.25
  },
  {
    id: "schedule",
    label: "6 months",
    kicker: "_05 Schedule",
    title: "6개월,\n==세미나와 공유 미팅==으로 갑니다",
    lede: "전사 세미나와 격주 리뷰로 피드백 시간을 확보합니다. 빠르게 바뀌는 기술에 바로 대응하고, 노하우의 축적을 우선합니다.",
    layout: "phases",
    timeline: {
      months: [{ m: "12월", y: "2026" }, { m: "1월", y: "2027" }, { m: "2월" }, { m: "3월" }, { m: "4월" }, { m: "5월" }, { m: "6월" }],
      phases: [
        { name: "착수 · 진단", meta: "1개월", from: 0, to: 0 },
        { name: "파일럿 수행 · 피드백", meta: "4개월", from: 1, to: 4 },
        { name: "확산 · 체계화", meta: "2개월", from: 5, to: 6 }
      ],
      events: [
        { at: 0, text: ["팀원 모집 · 착수", "==12월 세미나==", "인원 모집 공고"] },
        { at: 1, text: ["1차 설문조사", "공유 플랫폼"] },
        { at: 2, text: ["개발"] },
        { at: 3, to: 4, text: ["==파일럿 프로젝트 선정 및 착수=="] },
        { at: 5, text: ["2차 설문조사", "개발 진행 공유"] },
        { at: 6, text: ["==확대=="] }
      ]
    },
    items: [
      { head: "착수 · 진단", meta: "2026.12 · 1개월", body: "팀원 모집과 착수. ==12월 세미나==(인원 모집 공고), 아이디어 발굴 설문 준비" },
      { head: "파일럿 수행 · 피드백", meta: "2027.01–04 · 4개월", body: "1월 1차 설문조사 · 공유 플랫폼, 2월 개발, 3–4월 ==파일럿 프로젝트 선정 및 착수==" },
      { head: "확산 · 체계화", meta: "2027.05–06 · 2개월", body: "5월 2차 설문조사 · 개발 진행 공유, 6월 ==확대==" }
    ],
    groups: [1, 1, 1],
    takeaway: "월별 세미나 · 매월 진행",
    haze: 0.32,
    tone: 0.15
  },
  {
    id: "team",
    label: "Team",
    kicker: "_06 Team",
    title: "작게 시작해,\n==전사로 넓힙니다==",
    lede: "초기 테스트 베드에서 여러 프로젝트에 적용하고 효과를 검증한 뒤, 전사적으로 교육하고 확대합니다.",
    layout: "pairs",
    items: [
      { head: "시범운영 단계", meta: "Pilot", big: "SID", body: "PL 2인 + SID 내 2–3인, ==최대 5인 체제==" },
      { head: "확산 단계", meta: "Scale", big: "SIAPLAN", body: "==본부별 담당 리더== 지정 — SID · 1본부 · 2본부" }
    ],
    groups: [1, 1],
    takeaway: "초기 TF 구성, 그리고 전사 확산",
    haze: 0.45,
    tone: 0
  }
];
