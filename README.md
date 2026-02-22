# Re-Archive

> 잊혀진 건물과 실현되지 못한 공간을 기록하는 아카이브 플랫폼  
> An archive platform documenting forgotten and unrealized architectural spaces.

---

## 프로젝트 소개

**Re-Archive**는 서울과 전 세계의 기록되지 않은 건물, 실현되지 못한 설계안,
그리고 도시 레이어 속에 숨겨진 공간을 재발견하는 아카이브입니다.
Re:Layer 스튜디오가 운영하며, GitHub Pages를 통해 배포됩니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 마크업 | HTML5 (시맨틱) |
| 스타일 | CSS3 (Grid, Flexbox, clamp()) |
| 스크립트 | Vanilla JavaScript (ES6+) |
| 폰트 | Pretendard (CDN) |
| 배포 | GitHub Pages |
| 접근성 | WCAG 2.1 권장사항 준수 |

---

## 폴더 구조

```
goodcafe/
├── agents/
│   ├── 01_analyze.py
│   ├── 02_find_skills.py
│   ├── 03_improve_structure.py
│   ├── 04_check.py
│   ├── 05_publish.py
│   ├── README.md
│   └── run_all.sh
├── assets/
│   ├── images/
│   │   ├── project-01.jpg
│   │   ├── project-02.jpg
│   │   ├── project-03.jpg
│   │   ├── project-04.jpg
│   │   ├── project-ku-thumb.jpg
│   │   ├── project-museum-thumb.jpg
│   │   └── project-yibd-thumb.jpg
│   └── media/
├── css/
│   └── utils.css
├── docs/
│   ├── agents.md
│   └── skills.md
├── images/
│   ├── project-01.jpg
│   ├── project-02.jpg
│   ├── project-03.jpg
│   ├── project-04.jpg
│   ├── project-ku-thumb.jpg
│   ├── project-museum-thumb.jpg
│   ├── project-yibd-thumb.jpg
│   ├── whatif-ku-dorm-01.jpg
│   └── whatif-yibd-a2-01.jpg
├── js/
│   ├── contact.js
│   ├── lightbox.js
│   ├── main.js
│   ├── nav.js
│   └── whatif.js
├── media/
│   └── README.md
├── pages/
│   ├── project-city-edge-museum.html
│   ├── project-ku-dormitory.html
│   ├── project-yibd-a2.html
│   ├── projects.html
│   ├── what-if-ku-dormitory.html
│   ├── what-if-yibd-a2-tower.html
│   └── what-if.html
├── partials/
│   ├── footer.html
│   └── header.html
├── styles/
│   └── styles.css
├── CHANGELOG.md
├── README.md
├── index.html
└── main.js
```

---

## 페이지 구성

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 홈 | `index.html` | 히어로 슬라이더, 프로젝트 프리뷰, About |
| 프로젝트 | `pages/projects.html` | 아카이브 프로젝트 갤러리 |
| What-if | `pages/what-if.html` | 실현되지 못한 건축 시나리오 |

---

## 에이전트 시스템

이 레포지토리는 자동화 에이전트(`agents/`)로 관리됩니다:

| 에이전트 | 설명 | 실행 |
|---------|------|------|
| `01_analyze.py` | 레포지토리 전체 분석 및 이슈 리포트 | `python3 agents/01_analyze.py` |
| `02_find_skills.py` | 누락된 JS/CSS 스킬 자동 생성 | `python3 agents/02_find_skills.py` |
| `03_improve_structure.py` | 폴더 구조 최적화 | `python3 agents/03_improve_structure.py` |
| `04_check.py` | HTML/JS/CSS 품질 검증 | `python3 agents/04_check.py` |
| `05_publish.py` | README/문서 자동화 및 배포 준비 | `python3 agents/05_publish.py` |

### 전체 파이프라인 실행

```bash
# 분석 → 스킬 생성 → 구조 개선 → 검증 → 배포 문서화
python3 agents/01_analyze.py
python3 agents/02_find_skills.py
python3 agents/03_improve_structure.py
python3 agents/04_check.py
python3 agents/05_publish.py
```

---

## 빠른 시작

```bash
# 1. 클론
git clone <repo-url>
cd goodcafe

# 2. 로컬 서버 실행 (Python 3)
python3 -m http.server 8080

# 3. 브라우저에서 확인
open http://localhost:8080
```

> **참고**: 파셜(header/footer)은 fetch()로 로드되므로  
> 로컬 파일(`file://`) 대신 반드시 로컬 서버를 사용하세요.

---

## 통계

| 항목 | 값 |
|------|-----|
| 총 파일 | 57개 |
| HTML | 10개 |
| JavaScript | 6개 |
| CSS | 2개 |
| 이미지 | 16개 |
| 총 코드 라인 | 6,421줄 |
| 총 크기 | 5319.6 KB |

---

## 개발 가이드

### 새 프로젝트 페이지 추가

1. `pages/` 디렉토리에 새 HTML 파일 생성
2. `partials/header.html`의 네비게이션에 링크 추가
3. `index.html` 프로젝트 섹션에 카드 추가

### 이미지 추가

- 원본 이미지: `images/` (또는 `assets/images/`)
- 권장 포맷: WebP (성능), JPG (호환성 폴백)
- 권장 크기: 1920×1080 이하, 500KB 이하

### 코딩 컨벤션

- **HTML**: 시맨틱 태그, BEM-like 클래스명, ARIA 속성
- **CSS**: CSS 변수, clamp()로 유동 타이포그래피, Mobile-first
- **JS**: `use strict`, IIFE 패턴, IntersectionObserver 활용

---

_Last updated: 2026-02-22 by `agents/05_publish.py`_