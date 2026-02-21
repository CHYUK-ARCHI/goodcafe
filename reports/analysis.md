# Re-Archive 레포지토리 분석 리포트

> 생성일시: 2026-02-21 12:59:15  
> 분석 에이전트: `agents/01_analyze.py`

---

## 요약

| 항목 | 값 |
|------|-----|
| 총 파일 수 | 19개 |
| 총 코드 라인 | 4,486줄 |
| 총 크기 | 2705.6 KB |
| 발견된 이슈 | 🔴 HIGH 26 / 🟡 MEDIUM 1 / 🟢 LOW 0 |

---

## 파일 구조

```
goodcafe/
├── README.md
├── index.html
├── main.js
├── agents/
    ├── 01_analyze.py
    ├── 02_find_skills.py
    ├── 03_improve_structure.py
    ├── 04_check.py
    ├── 05_publish.py
    ├── README.md
    └── run_all.sh
├── images/
    ├── project-01.jpg
    ├── project-02.jpg
    ├── project-03.jpg
    └── project-04.jpg
├── pages/
    ├── projects.html
    └── what-if.html
├── partials/
    ├── footer.html
    └── header.html
└── styles/
    └── styles.css
```

---

## 카테고리별 통계

| 카테고리 | 파일 수 | 총 라인 | 총 크기 |
|---------|--------|--------|--------|
| CSS | 1 | 295 | 7.2 KB |
| HTML | 5 | 634 | 22.5 KB |
| Image | 4 | 0 | 2551.1 KB |
| JavaScript | 1 | 158 | 4.5 KB |
| Markdown | 2 | 47 | 1.3 KB |
| Python | 5 | 3,290 | 116.0 KB |
| Shell | 1 | 62 | 3.0 KB |

---

## HTML 참조 분석

### Scripts (2개)
- `main.js` ← `index.html`
- `whatif.js` ← `pages/what-if.html`

### Styles (4개)
- `styles.css` ← `pages/projects.html`
- `styles.css` ← `pages/what-if.html`
- `styles.css` ← `partials/footer.html`
- `styles.css` ← `partials/header.html`

### Images (8개)
- `images/project-ku-thumb.jpg` ← `index.html`
- `images/project-yibd-thumb.jpg` ← `index.html`
- `images/project-museum-thumb.jpg` ← `index.html`
- `images/project-ku-thumb.jpg` ← `pages/projects.html`
- `images/project-yibd-thumb.jpg` ← `pages/projects.html`
- `images/project-museum-thumb.jpg` ← `pages/projects.html`
- `images/whatif-ku-dorm-01.jpg` ← `pages/what-if.html`
- `images/whatif-yibd-a2-01.jpg` ← `pages/what-if.html`

### Links (19개)
- `projects.html` ← `index.html`
- `projects.html` ← `index.html`
- `index.html` ← `pages/projects.html`
- `archives.html` ← `pages/projects.html`
- `stories.html` ← `pages/projects.html`
- `what-if.html` ← `pages/projects.html`
- `projects.html` ← `pages/projects.html`
- `about.html` ← `pages/projects.html`
- `project-ku-dormitory.html` ← `pages/projects.html`
- `project-yibd-a2.html` ← `pages/projects.html`
- _(외 9개)_

---

## JavaScript 패턴 분석

### 발견된 현대적 패턴

- ✅ `IntersectionObserver` in `main.js`
- ✅ `ReducedMotion` in `main.js`
- ✅ `DOMContentLoaded` in `main.js`

---

## CSS 기능 분석

### 발견된 현대적 CSS 기능

- ✅ `clamp(` in `styles/styles.css`
- ✅ `grid-template` in `styles/styles.css`

---

## 발견된 이슈

### 🔴 HIGH (26개)

- **[missing_file]** 참조된 파일이 존재하지 않음: `whatif.js` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `styles.css` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `styles.css` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `styles.css` (in `partials/footer.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `styles.css` (in `partials/header.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-ku-thumb.jpg` (in `index.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-yibd-thumb.jpg` (in `index.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-museum-thumb.jpg` (in `index.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-ku-thumb.jpg` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-yibd-thumb.jpg` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/project-museum-thumb.jpg` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/whatif-ku-dorm-01.jpg` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `images/whatif-yibd-a2-01.jpg` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `projects.html` (in `index.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `projects.html` (in `index.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `archives.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `stories.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `about.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `project-ku-dormitory.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `project-yibd-a2.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `project-city-edge-museum.html` (in `pages/projects.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `archives.html` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `stories.html` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `about.html` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `what-if-ku-dormitory.html` (in `pages/what-if.html`)
- **[missing_file]** 참조된 파일이 존재하지 않음: `what-if-yibd-a2-tower.html` (in `pages/what-if.html`)

### 🟡 MEDIUM (1개)

- **[structure]** JS 파일(1개)이 루트에 위치 - `js/` 디렉토리로 이동 권장

---

## 권장 개선 사항

에이전트 시스템을 통해 자동으로 수행할 수 있는 개선 사항:

1. **`02_find_skills.py`** - 누락된 기능(whatif.js, contact form 등) 자동 생성
2. **`03_improve_structure.py`** - 폴더 구조 재편성 (`js/`, `css/`, `assets/` 분리)
3. **`04_check.py`** - HTML 유효성, 깨진 링크, 접근성 검사
4. **`05_publish.py`** - README 업데이트 및 GitHub Pages 배포

---

_이 리포트는 `agents/01_analyze.py`에 의해 자동 생성되었습니다._