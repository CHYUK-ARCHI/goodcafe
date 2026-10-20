# SIAPLAN AI/AX — Onboarding

건축설계 프로세스를 어떻게 다시 설계하는지 보여주는 스크롤 기반 선언문(manifesto) 페이지.
`AI → Task → Workflow → System → Architect as Orchestrator` 를 9개 장면으로 이어 보여준다.

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

| 장면 | 파일 | 모션 |
|---|---|---|
| 00 Declaration | `scenes/HeroScene.tsx` | × 글리프가 + 십자선으로 회전·확장, 선언문 마스크 |
| 01 From AI to AX | `scenes/FromAIToAX.tsx` | 액소노메트릭 판 4장이 쌓였다가 하나로 조립 |
| 02 Break the work | `scenes/BreakTheWork.tsx` | 단어가 Task 노드로 흩어지고 선이 그려짐 |
| 03 The new workflow | `scenes/WorkflowScene.tsx` | 6단계 리스트 · 타이틀 · CLI 패널 동기화 |
| 04 Human × Agent × Tool | `scenes/OrchestratorScene.tsx` | 선형 구조 해체 → 네트워크 재구성 |
| 05 What we build | `scenes/BuildScene.tsx` | 항목별로 평면 셀이 점등 |
| 06 Showreel | `scenes/ShowreelScene.tsx` | 스크롤로 영상 프레임 스크러빙 |
| 07 Roadmap | `scenes/RoadmapScene.tsx` | 6개월 레일 + 카드 |
| 08 SIAPLAN AI/AX | `scenes/FinalScene.tsx` | 마지막 문장 · 워드마크 · spectrum hairline |

- 모든 장면은 `lib/motion.ts` 의 `useScrollScene` 으로 만든 scrub 타임라인 하나 (스크롤 위치 ↔ 진행도 1:1).
- 장면 DOM 기본값은 "완성된 상태". 데스크톱+모션 허용일 때만 sticky 스테이지와 초기 상태를 적용하므로, 모바일·`prefers-reduced-motion` 에서는 정적 세로 레이아웃이 그대로 보인다.
- 스태거가 걸린 `fromTo` 를 쓰는 타임라인에는 `invalidateOnRefresh` 를 쓰지 않는다 (refresh 시 시작 상태가 사라짐).

## 디자인 규칙 (DESIGN.md 기반)

- 캔버스 `#fafafa`, 텍스트 `#171717 / #4d4d4d / #666`, 테두리 hairline ring. 그림자 없음, radius 6px.
- 헤드라인 Geist 400–450 · tracking -0.06em · line-height 1.0. 라벨·메타는 항상 Geist Mono 11–12px 대문자.
- 유채색은 두 곳뿐: ✓ 확인 표시의 Terminal Green `#297a3a`, 선언 순간의 Spectrum hairline.
- 브랜드 글리프는 `×` (Architecture × Intelligence). 순수 `#000` 은 글리프에만.

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
