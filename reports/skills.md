# 스킬 발굴 & 생성 리포트

> 생성일시: 2026-02-21 12:59:20  
> 분석 에이전트: `agents/02_find_skills.py`

---

## 생성된 스킬

| 스킬 | 파일 경로 | 상태 | 라인 수 |
|------|----------|------|--------|
| What-if 필터 기능 | `js/whatif.js` | ✅ created | 142 |
| 연락처 폼 유효성 검사 | `js/contact.js` | ✅ created | 108 |
| 모바일 네비게이션 토글 | `js/nav.js` | ✅ created | 88 |
| 이미지 라이트박스 | `js/lightbox.js` | ✅ created | 125 |
| 유틸리티 CSS | `css/utils.css` | ✅ created | 245 |

---

## 스킬별 설명

### What-if 필터 기능

- **파일**: `js/whatif.js`
- **설명**: 카테고리 필터 버튼으로 What-if 프로젝트 카드 필터링
- **라인**: 142줄

### 연락처 폼 유효성 검사

- **파일**: `js/contact.js`
- **설명**: 이메일/이름 폼 클라이언트 사이드 유효성 검사
- **라인**: 108줄

### 모바일 네비게이션 토글

- **파일**: `js/nav.js`
- **설명**: 모바일 햄버거 메뉴 토글 및 접근성
- **라인**: 88줄

### 이미지 라이트박스

- **파일**: `js/lightbox.js`
- **설명**: 프로젝트 이미지 클릭 시 전체화면 라이트박스
- **라인**: 125줄

### 유틸리티 CSS

- **파일**: `css/utils.css`
- **설명**: 재사용 가능한 유틸리티 CSS 클래스 모음
- **라인**: 245줄

---

## HTML 연동 방법

생성된 스킬을 HTML에 추가하려면:

```html
<!-- pages/what-if.html에 추가 -->
<script src="../js/whatif.js"></script>

<!-- partials/header.html에 추가 -->
<script src="../js/nav.js"></script>

<!-- 전역 CSS (index.html <head>에 추가) -->
<link rel="stylesheet" href="css/utils.css">
```

_이 리포트는 `agents/02_find_skills.py`에 의해 자동 생성되었습니다._