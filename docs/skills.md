# 스킬(Skills) 가이드

## 개요

`agents/02_find_skills.py`가 생성하는 JavaScript/CSS 스킬 파일들의 사용법입니다.

---

## js/whatif.js

**What-if 카테고리 필터 기능**

HTML에서 `data-filter` 버튼과 `data-category` 카드를 연결합니다.

```html
<!-- pages/what-if.html -->
<div class="filter-buttons">
  <button data-filter="all">All</button>
  <button data-filter="2nd-prize">2nd Prize</button>
  <button data-filter="cancelled">Cancelled</button>
  <button data-filter="unbuilt">Unbuilt</button>
</div>

<div class="whatif-card" data-category="2nd-prize">...</div>
<div class="whatif-card" data-category="unbuilt">...</div>

<script src="../js/whatif.js"></script>
```

**기능**: 클릭 필터링, URL hash 상태 보존, 스크린리더 알림, 애니메이션

---

## js/nav.js

**모바일 네비게이션 토글**

`<header role="banner">` 내의 `<nav>`를 자동으로 감지합니다.

```html
<!-- partials/header.html -->
<header role="banner">
  <a href="/" class="logo">Re-Archive</a>
  <nav>
    <a href="/pages/projects.html">Projects</a>
    <a href="/pages/what-if.html">What-if</a>
  </nav>
</header>
<script src="../js/nav.js"></script>
```

**기능**: 햄버거 버튼 자동 생성, ESC 닫기, 외부 클릭 닫기, ARIA

---

## js/lightbox.js

**이미지 라이트박스**

`data-lightbox` 속성이 있는 링크를 클릭하면 전체화면으로 표시합니다.

```html
<a href="images/project-01-large.jpg" data-lightbox data-caption="프로젝트 01">
  <img src="images/project-01.jpg" alt="프로젝트 01 썸네일" loading="lazy">
</a>
<script src="js/lightbox.js"></script>
```

**기능**: 키보드 탐색(←→ESC), 이전/다음 버튼, 페이드 전환

---

## js/contact.js

**연락처 폼 유효성 검사**

`id="contact-form"` 폼에 자동으로 적용됩니다.

```html
<form id="contact-form">
  <input name="name" type="text">
  <span id="name-error" hidden></span>
  <input name="email" type="email">
  <span id="email-error" hidden></span>
  <textarea name="message"></textarea>
  <span id="message-error" hidden></span>
  <button type="submit">보내기</button>
</form>
<script src="js/contact.js"></script>
```

---

## css/utils.css

**유틸리티 CSS 클래스**

전역 레이아웃, 타이포그래피, 색상 유틸리티 및 스킬 CSS 포함.

```html
<!-- index.html <head>에 추가 -->
<link rel="stylesheet" href="css/utils.css">
```

주요 클래스:
- `.sr-only` / `.visually-hidden` — 스크린리더 전용
- `.container` — 최대 너비 컨테이너
- `.grid-auto` — auto-fill 그리드
- `.is-hidden` / `.is-visible` — 표시/숨김

---

_이 문서는 `agents/05_publish.py`에 의해 자동 생성됩니다._
