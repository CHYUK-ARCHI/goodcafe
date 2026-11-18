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

「From AI to AX : SID_E STEP」 보고서(2611117_AIAX-2)를 축약한 **텍스트 중심 Vox 식 explainer**. 큰 헤드라인과 번호 붙은 줄로 설명하고, 강조는 색 없이 굵기로만 한다. 그림은 공유 흐름 도면 하나뿐.
보고서의 비용 · 문제점 · 다른 회사 사례 · 인원 구성은 넣지 않는다.

| 장면 | 파일 | 내용 |
|---|---|---|
| 00 표지 | `scenes/HeroScene.tsx` | From AI to AX : SID_E STEP, 한 줄 요약, 포스터 문구 |
| 01–02, 04–06 장 | `scenes/ChapterScene.tsx` + `lib/chapters.ts` | Why · What we share · Our direction · In progress · Schedule |
| 03 How we share | `scenes/SharingScene.tsx` | 각자 만든 프로그램 6개 → SIA 공유 플랫폼 → 모든 팀. SVG 도면 위로 점이 계속 흐른다(SMIL `animateMotion` + CSS 점선 · 펄스). 데스크톱은 가로, 모바일은 세로 도면. reduced-motion 이면 점은 숨김 |
| 마무리 | `scenes/FinalScene.tsx` | 마지막 문장 · 워드마크 |
| 07 Apply | `scenes/ApplyScene.tsx` | 모집 포스터 그대로 — career@siaplan.com · 마감 2026.11.25(수) 23:59 KST · D-day 자동 계산 |

- **장 내용은 `lib/chapters.ts` 한 파일**에서 고친다. 문자열 안의 `==문구==` 는 굵은 강조, `\n` 은 줄바꿈.
  `layout`(statements · grid · rows · pairs · phases)으로 줄 모양을, `groups` 로 스크롤 한 번에 들어올 줄 수를 정한다.
- **Schedule** 은 `timeline`(달 · 단계 · 그 달의 일)으로 데스크톱에서 가로 타임라인을 그린다. 모바일 · reduced-motion 은 같은 단계를 세로 타임라인으로 보여준다.
- 글씨 최소 크기: 본문 15px, 보조 14px, 라벨(모노) 13px.
- 포인트 색은 `--accent`(#ff4f1f, global.css) 하나. 흑백 화면 사이 의외의 자리 몇 곳에만 쓴다 — 목록은 scenes.css 맨 아래.
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
    장마다 `chapters.ts` 의 `haze` · `tone` 으로 정한다. 지금은 블루 중심, 03 Our direction 에서만 살짝 따뜻하게.
  - 세기: `section[data-haze]`(0–1). 선언·Final·Apply 0.65, Goals·Join 0.4–0.5, 정보 장면 0.15–0.35.
  - UI 강조색(✓, 강조 셀, 목표 태그)은 배경과 상관없이 블루로 고정.
- **포스터 타입** (`.poster`, `.poster-sm`): 800 weight · 자간 -0.065em · 행간 0.88. Hero 타이틀, 선언문, AX, 목표 숫자, Final, Apply 에만 쓴다.
- **언더스코어 문장** (`.underscore`, `lib/posterCopy.ts`): `_업무방식을 개선하는 사람으로` 등 포스터 문구. Hero 와 Apply 에 쓴다. 장면 번호도 `_01` 형식.
- 태그라인 `AI makes things possible. …` 은 Final 과 Apply 에.
- 유채색은 블루 하나 (✓ 표시, 강조 셀, 목표 태그, 진행선). 라벨·메타는 항상 Geist Mono 11–12px 대문자.
- 브랜드 글리프는 `×`. 순수 `#000` 은 글리프에만.
- 모바일도 같은 헤이즈와 포스터 구도(Hero·Final·Apply)를 쓴다.

## 영상

`public/video/siaplan-ax-teaser.{webm,mp4}` 는 `../hyperframes/teaser` 의 HyperFrames 컴포지션을 렌더링한 것 (텍스트 전용 개편 이후 페이지에서는 쓰지 않음).

```bash
cd ../hyperframes/teaser
npx hyperframes@0.8.179 check
npx hyperframes@0.8.179 render -o teaser.mp4
# 스크러빙용으로 키프레임을 촘촘하게 재인코딩
ffmpeg -i teaser.mp4 -an -c:v libx264 -crf 24 -g 3 -pix_fmt yuv420p -movflags +faststart ../../siaplan-ax/public/video/siaplan-ax-teaser.mp4
ffmpeg -i teaser.mp4 -an -c:v libvpx-vp9 -crf 34 -b:v 0 -g 3 ../../siaplan-ax/public/video/siaplan-ax-teaser.webm
```
