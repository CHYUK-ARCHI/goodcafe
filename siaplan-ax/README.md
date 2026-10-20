# SIAPLAN AI/AX — Onboarding

건축설계 프로세스를 어떻게 다시 설계하는지 보여주는 스크롤 기반 선언문(manifesto) 페이지.
문제의식 → 다른 회사 사례 → 우리의 움직임 → `AI → Task → Workflow → System → Architect as Orchestrator` → 목표 · 로드맵 · 지원 순으로 이어 보여준다.

## 실행

```bash
cd siaplan-ax
npm install
npm run dev        # 로컬 개발
npm run build      # dist/ 정적 빌드 (상대 경로라 어떤 GitHub Pages 경로에서도 동작)
```

배포: `main` 에 `siaplan-ax/**` 변경이 푸시되면 `.github/workflows/siaplan-ax-pages.yml` 이 빌드해 Pages 사이트 루트로 배포한다.
수동 재배포는 Actions → "Deploy SIAPLAN AI/AX page" → Run workflow. (Settings → Pages → Source = GitHub Actions)

## 구성

| 장면 | 파일 | 내용 · 모션 |
|---|---|---|
| 00 Declaration | `scenes/HeroScene.tsx` | × 글리프가 + 십자선으로 회전·확장, 선언문 |
| 01 Problem | `scenes/ProblemScene.tsx` | 문제의식 4가지(자료 찾기 · 법규검토 체계 · 비효율·공유 부재 · 소통 라인 부재)를 큰 영어 문장으로 하나씩, 오른쪽 아래 작은 한글 번역 (`lib/problems.ts`) |
| 02 Cases | `scenes/CasesScene.tsx` | 다른 회사 사례 — 대형(DA그룹 · 정림 · 해안 · 삼우 · 희림 참고) / 소형(내러티브 아키텍츠). 인스타그램 피드 형식의 사례 카드가 가로로 흐르고 스텝마다 한 장씩 앞으로. 카드마다 방법 · 출처 링크 · 검증 상태(보도 확인 / 회사 발표 / 확인 필요) (`lib/cases.ts`) |
| 03 Our move | `scenes/OurMoveScene.tsx` | 사례에서 읽은 6가지 패턴 → SIAPLAN 이 할 일 · 시기(로드맵 월) · 해결하는 문제(P01–P04)/목표 + 실행 계획 |
| 04 From AI to AX | `scenes/FromAIToAX.tsx` | 액소노메트릭 판 4장이 쌓였다가 하나로 조립 → AX |
| 05 Break the work | `scenes/BreakTheWork.tsx` | 단어가 Task 노드로 흩어지고 AI 경로가 그려짐 |
| 06 The new workflow | `scenes/WorkflowScene.tsx` | Define→Iterate 각 단계가 P01–P04 를 어떻게 푸는지 + 오른쪽 아래 한글 번역 + workflow.log |
| 07 Human × Agent × Tool | `scenes/OrchestratorScene.tsx` | 선형 구조 해체 → 네트워크 재구성 |
| 08 Showreel | `scenes/ShowreelScene.tsx` | 스크롤로 영상 프레임 스크러빙 |
| 09 Platform | `scenes/PlatformScene.tsx` | SID-DB · SIA AI · SIA Studio 레이어 + PMS 연동 |
| 10 Tools by phase × PMS | `scenes/PhaseToolsScene.tsx` | 단계별(현상·SD·DD·CD) 툴 + SIA AI 지원, PMS 바 |
| 11 Goals | `scenes/GoalsScene.tsx` | 10일 현상설계 · 3일 규모검토/법규 · 동영상 workflow · Add-on · SID-DB |
| 12 Roadmap | `scenes/RoadmapScene.tsx` | 6개월 월별 중간 작업과 연결된 목표 |
| 13 Join the team | `scenes/JoinScene.tsx` | 특전: AI 교육 · AI 계정 · 인센티브(예정) |
| 14 SIAPLAN AI/AX | `scenes/FinalScene.tsx` | 마지막 문장 · 워드마크 · spectrum hairline |
| 15 Apply | `scenes/ApplyScene.tsx` | 지원 포스터: career@siaplan.com · 마감 2026.10.31(토) 23:59 KST · D-day 자동 계산 · 하단 작은 글씨로 "건축가의 spirit" 문장과 Michael Graves(NYT, 2012) 발췌 |

- 모든 장면은 `lib/motion.ts` 의 `useScrollScene` 으로 만든 scrub 타임라인 하나 (스크롤 위치 ↔ 진행도 1:1).
- **장면 바** (`SceneRail.tsx`): 왼쪽에 장면마다 짧은 가로 바. 마우스를 대면 독처럼 확대되고 가장 가까운 장면 이름이 보이며, 클릭하면 그 장면의 첫 멈춤 지점으로 이동.
  터치는 누른 채 위아래로 끌면 확대·이름이 따라오고, 손을 떼면 이동.
- **스텝 스크롤** (`lib/smooth.ts`, `lib/stepper.ts`): 데스크톱에서는 휠 · ↓↑ · PageDown/Up · Space · 스와이프 한 번에 다음 "멈춤 지점"까지 이동하고 멈춘다.
  멈춤 지점은 각 장면에서 `steps(tl, [시간…])` 으로 붙인 라벨이다 (구도가 완성되는 시점). 트랙패드 관성 이벤트는 같은 제스처로 보고 무시한다.
  쇼릴은 스크러빙 대신 장면에 도착하면 자동 재생된다. 모바일·reduced-motion 은 기본 스크롤.
  창 크기가 바뀌어 데스크톱(≥900px) ↔ 모바일 레이아웃이 바뀌면 스텝 스크롤도 함께 켜지고 꺼진다. 멈춤 지점이 없을 때는 한 화면씩만 이동한다.
- 왼쪽 여백은 `--pad-l`(데스크톱 76px, 모바일 34px)로, 장면 바 자리를 비워 둔다. 왼쪽에 붙는 요소는 `left: var(--pad-l)` 을 쓴다.
- 장면 DOM 기본값은 "완성된 상태". 데스크톱+모션 허용일 때만 sticky 스테이지와 초기 상태를 적용하므로, 모바일·`prefers-reduced-motion` 에서는 정적 세로 레이아웃이 그대로 보인다.
- 스태거가 걸린 `fromTo` 를 쓰는 타임라인에는 `invalidateOnRefresh` 를 쓰지 않는다 (refresh 시 시작 상태가 사라짐).
- 마스크 안에서 숨겨 둘 때는 `yPercent: 130` 이상으로 내린다. 포스터 타입 마스크의 아래 여백(0.16em) 때문에 110 이면 글자 윗부분이 1px 선처럼 비친다.

## 디자인 규칙

DESIGN.md(무채색 · hairline · Geist)를 바탕으로, 지원 포스터(poster_final_V02)의 톤을 곳곳에 얹었다.

- 캔버스 쿨 그레이 `#eceef1`, 텍스트 `#171717 / #4d4d4d / #666`, 카드는 흰색 + hairline ring. 그림자 없음, radius 6px.
- **헤이즈** (`lib/Haze.tsx`): 페이지 뒤에 고정된 번진 블루(`#2f7fe6`). 옅은 톤(중심 알파 0.55)이 기본.
  - 움직임: 스크롤과 무관하게 CSS keyframes 로 아주 느리게 흐른다 (43·57·49초 주기, 이동 3–5% · 크기 ±4%, 모바일은 더 작게, reduced-motion 이면 정지).
  - 색: 같은 자리에 블루와 보색 살구(`#f2b47a`)를 겹쳐 두고 `section[data-tone]`(0=블루, 1=살구)로 교차 페이드한다.
    흐름은 한 번의 큰 파도 — 00–05 블루 (02–03 사례 장면에서 아주 살짝 따뜻하게) → 06–11 살구로 (Goals 에서 최대) → 12–13 복귀 → 14 Final · 15 Apply 원래 블루.
  - 세기: `section[data-haze]`(0–1). 선언·Final·Apply 0.65, Goals·Join 0.4–0.5, 정보 장면 0.15–0.35.
  - UI 강조색(✓, 강조 셀, 목표 태그)은 배경과 상관없이 블루로 고정.
- **포스터 타입** (`.poster`, `.poster-sm`): 800 weight · 자간 -0.065em · 행간 0.88. Hero 타이틀, 선언문, AX, 목표 숫자, Final, Apply 에만 쓴다.
- **언더스코어 문장** (`.underscore`, `lib/posterCopy.ts`): `_업무방식을 개선하는 사람으로` 등 포스터 문구. Hero 와 Apply 에 쓴다. 장면 번호도 `_01` 형식.
- 태그라인 `AI makes things possible. …` 은 Final 과 Apply 에.
- 유채색은 블루 하나 (✓ 표시, 강조 셀, 목표 태그, 진행선). 라벨·메타는 항상 Geist Mono 11–12px 대문자.
- 브랜드 글리프는 `×`. 순수 `#000` 은 글리프에만.
- 모바일도 같은 헤이즈와 포스터 구도(Hero·Final·Apply)를 쓴다.

## 영상

`public/video/siaplan-ax-teaser.{webm,mp4}` 는 `../hyperframes/teaser` 의 HyperFrames 컴포지션을 렌더링한 것.

```bash
cd ../hyperframes/teaser
npx hyperframes@0.8.179 check
npx hyperframes@0.8.179 render -o teaser.mp4
# 스크러빙용으로 키프레임을 촘촘하게 재인코딩
ffmpeg -i teaser.mp4 -an -c:v libx264 -crf 24 -g 3 -pix_fmt yuv420p -movflags +faststart ../../siaplan-ax/public/video/siaplan-ax-teaser.mp4
ffmpeg -i teaser.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -g 3 ../../siaplan-ax/public/video/siaplan-ax-teaser.webm
```

## 사례 카드 (02 Cases · 03 Our move)

- 데이터: `src/lib/cases.ts` — `CASES`(회사별 카드), `LESSONS`(패턴 → 우리 할 일). 카드를 추가·수정하면 두 장면이 같이 바뀐다.
- 카드는 **SIAPLAN AI/AX 가 공개 보도를 재구성한 것**이며 각 회사의 인스타그램 게시물·공식 로고가 아니다. 장면 하단에 같은 고지 문구가 있다.
- 회사 표시는 중립 타이포 이름 마크(`lib/NameMark.tsx`). 공식 로고 사용 허락을 받으면 파일을 `public/logos/<id>.svg` 에 넣고 해당 사례의 `logo: "logos/<id>.svg"` 를 채운다.
- `status`: `report`(보도 확인) · `claim`(회사 발표 수치) · `check`(세부 확인 필요). 근거가 확인되면 status 와 문구를 갱신한다.
- 데스크톱 트랙 이동은 CSS 변수 `--i` 하나로 계산한다(카드 폭 `--cw` · 간격 `--gap` 기준, 마지막 카드가 오른쪽 여백에 닿으면 멈춤). 창 크기가 바뀌어도 다시 계산할 필요가 없다.
