# 검증 리포트

> 생성일시: 2026-02-22 04:59:37  
> 에이전트: `agents/04_check.py`

---

## 요약

| 심각도 | 건수 |
|--------|------|
| 🔴 HIGH   | 10 |
| 🟡 MEDIUM | 6 |
| 🟢 LOW    | 18 |
| ℹ INFO    | 0 |
| **합계**  | **34** |

---

## 카테고리별 현황

| 카테고리 | 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW | ℹ INFO |
|---------|--------|----------|------|------|
| BrokenLink | 2 | 0 | 0 | 0 |
| HTML | 8 | 4 | 0 | 0 |
| SEO | 0 | 2 | 18 | 0 |

---

## 🔴 HIGH 이슈 (10개)

### [BrokenLink] 참조 파일 없음: `media/main-loop.webm`
- **위치**: `index.html:209`
- **권장**: 파일을 생성하거나 경로를 수정하세요: media/main-loop.webm

### [BrokenLink] 참조 파일 없음: `media/main-loop.mp4`
- **위치**: `index.html:210`
- **권장**: 파일을 생성하거나 경로를 수정하세요: media/main-loop.mp4

### [HTML] DOCTYPE 선언 없음
- **위치**: `partials/footer.html:1`
- **권장**: 파일 첫 줄에 <!DOCTYPE html> 추가

### [HTML] <html> 태그 없음
- **위치**: `partials/footer.html:1`

### [HTML] <head> 태그 없음
- **위치**: `partials/footer.html:1`

### [HTML] <body> 태그 없음
- **위치**: `partials/footer.html:1`

### [HTML] DOCTYPE 선언 없음
- **위치**: `partials/header.html:1`
- **권장**: 파일 첫 줄에 <!DOCTYPE html> 추가

### [HTML] <html> 태그 없음
- **위치**: `partials/header.html:1`

### [HTML] <head> 태그 없음
- **위치**: `partials/header.html:1`

### [HTML] <body> 태그 없음
- **위치**: `partials/header.html:1`

## 🟡 MEDIUM 이슈 (6개)

### [SEO] <title> 태그 없음
- **위치**: `partials/footer.html`
- **권장**: <head>에 <title> 추가

### [HTML] charset 선언 없음
- **위치**: `partials/footer.html`
- **권장**: <meta charset="UTF-8"> 추가

### [HTML] viewport meta 없음
- **위치**: `partials/footer.html`
- **권장**: <meta name="viewport" content="width=device-width, initial-scale=1"> 추가

### [SEO] <title> 태그 없음
- **위치**: `partials/header.html`
- **권장**: <head>에 <title> 추가

### [HTML] charset 선언 없음
- **위치**: `partials/header.html`
- **권장**: <meta charset="UTF-8"> 추가

### [HTML] viewport meta 없음
- **위치**: `partials/header.html`
- **권장**: <meta name="viewport" content="width=device-width, initial-scale=1"> 추가

## 🟢 LOW 이슈 (18개)

### [SEO] meta description 없음
- **위치**: `pages/project-city-edge-museum.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/project-city-edge-museum.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/project-ku-dormitory.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/project-ku-dormitory.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/project-yibd-a2.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/project-yibd-a2.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/projects.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/projects.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/what-if-ku-dormitory.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/what-if-ku-dormitory.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/what-if-yibd-a2-tower.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/what-if-yibd-a2-tower.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `pages/what-if.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `pages/what-if.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `partials/footer.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `partials/footer.html`
- **권장**: og:title, og:description, og:image 추가 권장

### [SEO] meta description 없음
- **위치**: `partials/header.html`
- **권장**: <meta name="description" content="..."> 추가

### [SEO] Open Graph 태그 없음
- **위치**: `partials/header.html`
- **권장**: og:title, og:description, og:image 추가 권장

---

## 다음 단계

1. 🔴 HIGH 이슈부터 순서대로 수정
2. `agents/02_find_skills.py` 실행으로 누락 스킬 자동 생성
3. `agents/03_improve_structure.py` 실행으로 구조 개선
4. `agents/05_publish.py` 실행으로 배포 및 문서화

_이 리포트는 `agents/04_check.py`에 의해 자동 생성되었습니다._