import type { ProblemId } from "./problems";

/**
 * 다른 회사 AI/AX 사례 — 공개 보도·회사 발표를 SIAPLAN AI/AX 가 재구성한 카드.
 * 각 회사의 공식 게시물·로고가 아니다. 공식 로고 파일을 받으면 public/logos/<id>.svg 로 넣고 logo 를 채운다.
 *
 * status
 *   report — 언론 보도로 확인
 *   claim  — 회사 발표 수치 (독립 검증 아님)
 *   check  — 세부 내용 확인 필요
 */
export type CaseStatus = "report" | "claim" | "check";

export type Case = {
  id: string;
  name: string;
  mark: string; // 아바타 안의 이름 마크
  tier: "Large" | "Small";
  logo?: string;
  // 포스트 이미지 영역
  big: string;
  sub: string;
  flow: string[];
  // 캡션
  title: string;
  how: string[];
  tags: string[];
  status: CaseStatus;
  sources: { label: string; url: string }[];
};

export const CASES: Case[] = [
  {
    id: "da",
    name: "DA그룹",
    mark: "DA",
    tier: "Large",
    big: "10 days",
    sub: "공모 1건 · 3인 (AI 실무 2인)",
    flow: ["Past competition", "ChatGPT · Midjourney · Rhino", "Data-linked order", "10 days"],
    title: "지난 공모를 AI 로 다시 풀었다",
    how: [
      "2025년 초 사내 'DA AI 태스크포스(TF)' 구성",
      "과거 공모 '고덕강일 2-2BL 업무시설'을 같은 조건으로 재현",
      "ChatGPT · Midjourney · Rhino 를 데이터로 연결해 작업 순서를 재구성",
      "근무시간 내 10일, 7–8명이 하던 일을 2–3명이 수행"
    ],
    tags: ["#TF", "#공모재현", "#10일"],
    status: "report",
    sources: [
      { label: "대한경제 2025.05", url: "https://m.dnews.co.kr/m_home/view.jsp?idxno=202505141638260030181" },
      { label: "DA그룹 미디어", url: "https://dagroup.kr/inside/media.php?category=&code=media&idx=1342&ptype=view" }
    ]
  },
  {
    id: "junglim",
    name: "정림건축",
    mark: "정림",
    tier: "Large",
    big: "Sketch → Image",
    sub: "DX팀이 만든 도구를 밖으로 공개",
    flow: ["DX팀", "Archigen", "SolarLink", "Patent"],
    title: "DX팀이 도구를 만들어 배포했다",
    how: [
      "이노베이션본부 DX팀이 AI 이미지 서비스 'Archigen' 개발 · 무료 공개",
      "스케치를 넣으면 건축 이미지로 — 초기 대안 검토 속도",
      "'SolarLink': BIPV 설계 자동화 (법규 · 음영 · 모듈 배치 · 발전량 · 경제성)",
      "3년 국가 R&D, 디지털전환팀 · BIM팀 · 그린테크팀 협업, 특허 출원"
    ],
    tags: ["#DX팀", "#자체도구", "#BIPV"],
    status: "report",
    sources: [
      { label: "정림건축 뉴스 · Archigen", url: "http://www.junglim.co.kr/about/news/725/view" },
      { label: "건축사신문 · SolarLink", url: "https://www.ancnews.kr/news/articleView.html?idxno=19513" }
    ]
  },
  {
    id: "haeahn",
    name: "해안건축",
    mark: "해안",
    tier: "Large",
    big: "B5 → B3",
    sub: "주차로봇 전제 지하주차장 (회사 발표)",
    flow: ["MOU", "Parking robot", "Early design", "Less depth"],
    title: "설계 초기부터 로봇을 전제로 그렸다",
    how: [
      "2025.10 HL로보틱스와 업무협약 — '로보 아키텍처'",
      "주차로봇 'Parkie' 운용을 계획설계 단계부터 반영",
      "첫 적용 대상은 지하주차장",
      "주차대수 최대 30% 증가 · 지하 5층 → 3층 가능 (회사 발표 수치)"
    ],
    tags: ["#협업", "#로보아키텍처", "#주차"],
    status: "claim",
    sources: [
      { label: "한국경제 2025.10", url: "https://www.hankyung.com/article/202510286833i" },
      { label: "ZDNet Korea 2025.10", url: "https://zdnet.co.kr/view/?no=20251028104403" }
    ]
  },
  {
    id: "samoo",
    name: "삼우",
    mark: "삼우",
    tier: "Large",
    big: "In-house contest",
    sub: "사내 생성형 AI 활용 공모전",
    flow: ["Contest", "Use cases", "PoC", "SAI"],
    title: "사내 공모전으로 활용을 퍼뜨렸다",
    how: [
      "2024 상반기 사내 '생성형 AI 활용 공모전' 개최",
      "현업이 직접 쓰는 활용 사례를 모아 확산",
      "2025.04 성수 PoC 개관 — 기술 · 건축 융합 실험 공간",
      "관계사 삼우씨엠은 CM 분야 AI 'SAI' 공개",
      "정식 AX 조직 · 세부 자동화 수치는 공개 자료로 미확인"
    ],
    tags: ["#사내공모전", "#확산", "#CM"],
    status: "check",
    sources: [
      { label: "대한경제 2024.10", url: "https://m.dnews.co.kr/m_home/view.jsp?idxno=202410101514416530982" },
      { label: "대한경제 2025.04 · 성수 PoC", url: "https://www.dnews.co.kr/uhtml/view.jsp?idxno=202504181203445340930" }
    ]
  },
  {
    id: "heerim",
    name: "희림",
    mark: "희림",
    tier: "Large",
    big: "Direction first",
    sub: "참고 사례 · 방향 발표",
    flow: ["2024 plan", "AI workflow", "Design automation"],
    title: "방향을 먼저 선언했다",
    how: [
      "2024 연초 'AI 기반 차세대 업무 프로세스 구축 · 설계 자동화' 방향 발표",
      "모듈러 · 해외 확대와 함께 제시",
      "'희AI프로' 명칭은 2025.03 보도 제목에서만 확인 — 세부 내용 확인 필요"
    ],
    tags: ["#참고", "#방향"],
    status: "check",
    sources: [
      { label: "스마트투데이 2024", url: "https://www.smarttoday.co.kr/ko-kr/articles/41476" },
      { label: "대한경제 2025.03", url: "https://www.dnews.co.kr/uhtml/view.jsp?idxno=202503102247067720536" }
    ]
  },
  {
    id: "narrative",
    name: "내러티브 아키텍츠",
    mark: "N",
    tier: "Small",
    big: "2 + 1",
    sub: "건축가 2인 + 프로그래머 1인",
    flow: ["Concept", "Perspectives", "Statement", "Submit"],
    title: "작은 팀이 AI 만으로 공모에 냈다",
    how: [
      "황남인 · 김시홍 + 프로그래머 이신후(옵티콘)",
      "국내 공공 설계공모를 AI 만으로 진행하는 실험",
      "컨셉 → 투시도 → 설계설명서까지 AI 파이프라인",
      "당선 여부는 공개 자료로 미확인"
    ],
    tags: ["#소형사무소", "#AI공모", "#파이프라인"],
    status: "report",
    sources: [
      { label: "VMSPACE", url: "https://vmspace.com/news/news_view.html?base_seq=MzU3NA%3D%3D" },
      { label: "narrativearchitects.com", url: "https://www.narrativearchitects.com/en" }
    ]
  }
];

export const STATUS_LABEL: Record<CaseStatus, string> = {
  report: "보도 확인",
  claim: "회사 발표",
  check: "확인 필요"
};

/** 사례에서 읽은 패턴 → SIAPLAN 이 할 일. Our move 장면이 쓴다. */
export const LESSONS: {
  en: string;
  seen: string[]; // CASES id
  seenNote: string;
  move: string;
  when: string;
  fix: (ProblemId | "10일" | "3일")[];
}[] = [
  {
    en: "Team first, tools second.",
    seen: ["da", "junglim", "samoo"],
    seenNote: "TF · DX팀 · 사내 공모전",
    move: "SIAPLAN AI/AX TF 를 먼저 꾸린다 — 이번 모집",
    when: "Now",
    fix: ["P03"]
  },
  {
    en: "Benchmark on a past competition.",
    seen: ["da"],
    seenNote: "지난 공모 재현 · 10일",
    move: "지난 공모 1건을 10일 안에 다시 풀어 기준선을 만든다",
    when: "M04",
    fix: ["10일"]
  },
  {
    en: "Automate the rules first.",
    seen: ["junglim", "da"],
    seenNote: "법규 · 규모 검토 자동화",
    move: "Legal CAD 로 규모검토 · 법규를 3일 안에",
    when: "M02–M03",
    fix: ["P02", "3일"]
  },
  {
    en: "Structure the data.",
    seen: ["da"],
    seenNote: "설계 자료를 데이터로 연결",
    move: "SID-DB 로 사내 자료를 구조화하고 AI 로 찾는다",
    when: "M01–M05",
    fix: ["P01"]
  },
  {
    en: "Small squad, full pipeline.",
    seen: ["narrative", "da"],
    seenNote: "2 + 1 · 3인 팀",
    move: "건축가 2–3 + 개발 1 스쿼드 단위로 파일럿을 돈다",
    when: "M02–",
    fix: ["P03"]
  },
  {
    en: "Bring new tech in early.",
    seen: ["haeahn"],
    seenNote: "로봇주차를 계획설계부터",
    move: "협력사 · MEP 검토를 SD 로 앞당기고 PMS 로 공유한다",
    when: "M03–M05",
    fix: ["P04"]
  }
];
