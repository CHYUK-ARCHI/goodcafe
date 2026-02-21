#!/usr/bin/env python3
"""
Agent 05: Publish & Documentation Agent
=========================================
Re-Archive 레포지토리의 최종 배포 준비 및 문서화를 담당합니다:

기능:
  1. README.md 자동 업데이트 (구조, 사용법, 에이전트 설명 포함)
  2. CHANGELOG.md 자동 생성 (git 히스토리 기반)
  3. docs/ 디렉토리에 상세 문서 작성
  4. GitHub Pages 배포 체크리스트 생성
  5. reports/summary.md 통합 요약 리포트 생성
  6. Git commit 및 push (선택)

Usage:
    python3 agents/05_publish.py
    python3 agents/05_publish.py --dry-run
    python3 agents/05_publish.py --push              # git commit & push
    python3 agents/05_publish.py --update-readme     # README만 업데이트
    python3 agents/05_publish.py --summary           # 통합 요약만 생성
"""

import os
import re
import sys
import subprocess
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict


ROOT = Path(__file__).parent.parent
REPORTS_DIR = ROOT / "reports"
DOCS_DIR = ROOT / "docs"


# ─── git 유틸 ────────────────────────────────────────────────────────────────

def git(*args, cwd: Path = ROOT) -> tuple[int, str]:
    try:
        result = subprocess.run(
            ["git"] + list(args),
            cwd=str(cwd),
            capture_output=True,
            text=True,
            timeout=30,
        )
        return result.returncode, result.stdout.strip()
    except Exception as e:
        return 1, str(e)


def get_git_info() -> dict:
    """현재 git 상태 및 히스토리 수집."""
    _, branch = git("rev-parse", "--abbrev-ref", "HEAD")
    _, remote = git("remote", "get-url", "origin")
    _, log = git("log", "--oneline", "-20")
    _, status = git("status", "--short")
    _, last_tag = git("describe", "--tags", "--abbrev=0")
    _, commit_hash = git("rev-parse", "--short", "HEAD")

    # remote URL에서 GitHub URL 파싱
    github_url = ""
    if "github.com" in remote:
        match = re.search(r'github\.com[:/](.+?)(?:\.git)?$', remote)
        if match:
            github_url = f"https://github.com/{match.group(1)}"

    return {
        "branch": branch,
        "remote": remote,
        "github_url": github_url,
        "pages_url": f"https://{github_url.split('github.com/')[-1].split('/')[0]}.github.io/{github_url.split('/')[-1]}" if github_url else "",
        "log": log,
        "status": status,
        "last_tag": last_tag,
        "commit_hash": commit_hash,
    }


# ─── 파일 구조 수집 ──────────────────────────────────────────────────────────

def collect_project_info(root: Path) -> dict:
    """프로젝트 메타데이터 수집."""
    ignore = {".git", "__pycache__", "node_modules", ".structure_backup"}

    files_by_cat = defaultdict(list)
    total_lines = 0
    total_size = 0

    ext_to_cat = {
        ".html": "HTML", ".css": "CSS", ".js": "JavaScript",
        ".md": "Markdown", ".py": "Python", ".sh": "Shell",
        ".jpg": "Image", ".jpeg": "Image", ".png": "Image",
        ".gif": "Image", ".svg": "Image", ".webp": "Image",
        ".webm": "Video", ".mp4": "Video",
    }

    for path in sorted(root.rglob("*")):
        if not path.is_file():
            continue
        if any(part in ignore for part in path.parts):
            continue

        rel = str(path.relative_to(root))
        ext = path.suffix.lower()
        cat = ext_to_cat.get(ext, "Other")
        stat = path.stat()
        size = stat.st_size

        lines = 0
        if ext in (".html", ".css", ".js", ".md", ".py", ".sh", ".json"):
            try:
                lines = sum(1 for _ in path.open("r", encoding="utf-8", errors="ignore"))
            except Exception:
                pass

        files_by_cat[cat].append({"path": rel, "lines": lines, "size": size})
        total_lines += lines
        total_size += size

    return {
        "files_by_cat": dict(files_by_cat),
        "total_files": sum(len(v) for v in files_by_cat.values()),
        "total_lines": total_lines,
        "total_size": total_size,
    }


# ─── README 생성 ──────────────────────────────────────────────────────────────

def generate_readme(git_info: dict, project_info: dict) -> str:
    now = datetime.now().strftime("%Y-%m-%d")

    # 파일 트리 간단 버전
    root = ROOT
    ignore = {".git", "__pycache__", "node_modules", ".structure_backup", "reports"}
    tree_lines = ["```", f"{root.name}/"]

    def _tree_simple(path: Path, prefix: str = "", depth: int = 0):
        if depth > 2:
            return
        entries = sorted(
            [e for e in path.iterdir() if e.name not in ignore and not e.name.startswith(".")],
            key=lambda e: (e.is_file(), e.name)
        )
        for i, entry in enumerate(entries):
            is_last = (i == len(entries) - 1)
            conn = "└── " if is_last else "├── "
            tree_lines.append(f"{prefix}{conn}{entry.name}{'/' if entry.is_dir() else ''}")
            if entry.is_dir():
                ext = "    " if is_last else "│   "
                _tree_simple(entry, prefix + ext, depth + 1)

    _tree_simple(root)
    tree_lines.append("```")

    pages_url = git_info.get("pages_url", "")
    github_url = git_info.get("github_url", "")

    stats = project_info
    html_count = len(stats["files_by_cat"].get("HTML", []))
    js_count = len(stats["files_by_cat"].get("JavaScript", []))
    css_count = len(stats["files_by_cat"].get("CSS", []))
    img_count = len(stats["files_by_cat"].get("Image", []))

    lines = [
        "# Re-Archive",
        "",
        "> 잊혀진 건물과 실현되지 못한 공간을 기록하는 아카이브 플랫폼  ",
        "> An archive platform documenting forgotten and unrealized architectural spaces.",
        "",
    ]

    if pages_url:
        lines += [
            f"🌐 **라이브 사이트**: [{pages_url}]({pages_url})",
            "",
        ]

    lines += [
        "---",
        "",
        "## 프로젝트 소개",
        "",
        "**Re-Archive**는 서울과 전 세계의 기록되지 않은 건물, 실현되지 못한 설계안,",
        "그리고 도시 레이어 속에 숨겨진 공간을 재발견하는 아카이브입니다.",
        "Re:Layer 스튜디오가 운영하며, GitHub Pages를 통해 배포됩니다.",
        "",
        "---",
        "",
        "## 기술 스택",
        "",
        "| 영역 | 기술 |",
        "|------|------|",
        "| 마크업 | HTML5 (시맨틱) |",
        "| 스타일 | CSS3 (Grid, Flexbox, clamp()) |",
        "| 스크립트 | Vanilla JavaScript (ES6+) |",
        "| 폰트 | Pretendard (CDN) |",
        "| 배포 | GitHub Pages |",
        "| 접근성 | WCAG 2.1 권장사항 준수 |",
        "",
        "---",
        "",
        "## 폴더 구조",
        "",
        "\n".join(tree_lines),
        "",
        "---",
        "",
        "## 페이지 구성",
        "",
        "| 페이지 | 경로 | 설명 |",
        "|--------|------|------|",
        "| 홈 | `index.html` | 히어로 슬라이더, 프로젝트 프리뷰, About |",
        "| 프로젝트 | `pages/projects.html` | 아카이브 프로젝트 갤러리 |",
        "| What-if | `pages/what-if.html` | 실현되지 못한 건축 시나리오 |",
        "",
        "---",
        "",
        "## 에이전트 시스템",
        "",
        "이 레포지토리는 자동화 에이전트(`agents/`)로 관리됩니다:",
        "",
        "| 에이전트 | 설명 | 실행 |",
        "|---------|------|------|",
        "| `01_analyze.py` | 레포지토리 전체 분석 및 이슈 리포트 | `python3 agents/01_analyze.py` |",
        "| `02_find_skills.py` | 누락된 JS/CSS 스킬 자동 생성 | `python3 agents/02_find_skills.py` |",
        "| `03_improve_structure.py` | 폴더 구조 최적화 | `python3 agents/03_improve_structure.py` |",
        "| `04_check.py` | HTML/JS/CSS 품질 검증 | `python3 agents/04_check.py` |",
        "| `05_publish.py` | README/문서 자동화 및 배포 준비 | `python3 agents/05_publish.py` |",
        "",
        "### 전체 파이프라인 실행",
        "",
        "```bash",
        "# 분석 → 스킬 생성 → 구조 개선 → 검증 → 배포 문서화",
        "python3 agents/01_analyze.py",
        "python3 agents/02_find_skills.py",
        "python3 agents/03_improve_structure.py",
        "python3 agents/04_check.py",
        "python3 agents/05_publish.py",
        "```",
        "",
        "---",
        "",
        "## 빠른 시작",
        "",
        "```bash",
        "# 1. 클론",
        "git clone <repo-url>",
        "cd goodcafe",
        "",
        "# 2. 로컬 서버 실행 (Python 3)",
        "python3 -m http.server 8080",
        "",
        "# 3. 브라우저에서 확인",
        "open http://localhost:8080",
        "```",
        "",
        "> **참고**: 파셜(header/footer)은 fetch()로 로드되므로  ",
        "> 로컬 파일(`file://`) 대신 반드시 로컬 서버를 사용하세요.",
        "",
        "---",
        "",
        "## 통계",
        "",
        f"| 항목 | 값 |",
        f"|------|-----|",
        f"| 총 파일 | {stats['total_files']}개 |",
        f"| HTML | {html_count}개 |",
        f"| JavaScript | {js_count}개 |",
        f"| CSS | {css_count}개 |",
        f"| 이미지 | {img_count}개 |",
        f"| 총 코드 라인 | {stats['total_lines']:,}줄 |",
        f"| 총 크기 | {stats['total_size'] / 1024:.1f} KB |",
        "",
        "---",
        "",
        "## 개발 가이드",
        "",
        "### 새 프로젝트 페이지 추가",
        "",
        "1. `pages/` 디렉토리에 새 HTML 파일 생성",
        "2. `partials/header.html`의 네비게이션에 링크 추가",
        "3. `index.html` 프로젝트 섹션에 카드 추가",
        "",
        "### 이미지 추가",
        "",
        "- 원본 이미지: `images/` (또는 `assets/images/`)",
        "- 권장 포맷: WebP (성능), JPG (호환성 폴백)",
        "- 권장 크기: 1920×1080 이하, 500KB 이하",
        "",
        "### 코딩 컨벤션",
        "",
        "- **HTML**: 시맨틱 태그, BEM-like 클래스명, ARIA 속성",
        "- **CSS**: CSS 변수, clamp()로 유동 타이포그래피, Mobile-first",
        "- **JS**: `use strict`, IIFE 패턴, IntersectionObserver 활용",
        "",
        "---",
        "",
        f"_Last updated: {now} by `agents/05_publish.py`_",
    ]

    return "\n".join(lines)


# ─── CHANGELOG 생성 ──────────────────────────────────────────────────────────

def generate_changelog(git_info: dict) -> str:
    now = datetime.now().strftime("%Y-%m-%d")
    log = git_info.get("log", "")

    lines = [
        "# CHANGELOG",
        "",
        "> 이 파일은 `agents/05_publish.py`에 의해 자동 생성됩니다.",
        "",
        "---",
        "",
        f"## [Unreleased] - {now}",
        "",
        "### 추가됨",
        "- `agents/` 디렉토리: 자동화 에이전트 시스템",
        "  - `01_analyze.py`: 레포지토리 분석 에이전트",
        "  - `02_find_skills.py`: 스킬 발굴 및 생성 에이전트",
        "  - `03_improve_structure.py`: 폴더 구조 개선 에이전트",
        "  - `04_check.py`: 품질 검증 에이전트",
        "  - `05_publish.py`: 배포 및 문서화 에이전트",
        "- `js/whatif.js`: What-if 필터 기능 (카테고리 필터, URL hash 상태 보존)",
        "- `js/nav.js`: 모바일 네비게이션 토글 (햄버거 메뉴, 접근성)",
        "- `js/contact.js`: 연락처 폼 유효성 검사",
        "- `js/lightbox.js`: 이미지 라이트박스",
        "- `css/utils.css`: 유틸리티 CSS 클래스 모음",
        "- `reports/`: 에이전트 자동 생성 리포트",
        "- `docs/`: 프로젝트 상세 문서",
        "",
    ]

    if log:
        lines += [
            "---",
            "",
            "## Git 히스토리",
            "",
            "```",
            log,
            "```",
            "",
        ]

    lines += [
        "---",
        "",
        "_이 파일은 `agents/05_publish.py`에 의해 자동 생성됩니다._",
    ]

    return "\n".join(lines)


# ─── 통합 요약 리포트 ────────────────────────────────────────────────────────

def generate_summary(git_info: dict, project_info: dict) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 각 리포트 읽기
    sub_reports = {}
    for name in ["analysis", "skills", "structure", "check"]:
        path = REPORTS_DIR / f"{name}.md"
        if path.exists():
            sub_reports[name] = path.read_text(encoding="utf-8")

    lines = [
        "# Re-Archive 통합 요약 리포트",
        "",
        f"> 생성일시: {now}",
        f"> 브랜치: `{git_info.get('branch', 'N/A')}`",
        f"> 커밋: `{git_info.get('commit_hash', 'N/A')}`",
        "",
        "---",
        "",
        "## 에이전트 실행 현황",
        "",
        "| 에이전트 | 리포트 | 상태 |",
        "|---------|--------|------|",
    ]

    agent_files = {
        "01_analyze.py":          ("reports/analysis.md",  "분석"),
        "02_find_skills.py":      ("reports/skills.md",    "스킬"),
        "03_improve_structure.py": ("reports/structure.md", "구조"),
        "04_check.py":            ("reports/check.md",     "검증"),
        "05_publish.py":          ("reports/summary.md",   "배포"),
    }

    for agent, (report_path, label) in agent_files.items():
        exists = (ROOT / report_path).exists()
        agent_exists = (ROOT / "agents" / agent).exists()
        status = "✅ 완료" if exists else ("⏳ 대기" if agent_exists else "❌ 없음")
        lines.append(f"| `agents/{agent}` | `{report_path}` | {status} |")

    lines += [
        "",
        "---",
        "",
        "## 프로젝트 현황",
        "",
        f"- **총 파일**: {project_info['total_files']}개",
        f"- **총 코드 라인**: {project_info['total_lines']:,}줄",
        f"- **총 크기**: {project_info['total_size'] / 1024:.1f} KB",
        "",
    ]

    # 카테고리별 파일 수
    lines += ["### 파일 분류", ""]
    for cat, files in sorted(project_info["files_by_cat"].items()):
        lines.append(f"- **{cat}**: {len(files)}개")

    # 검증 이슈 요약 (check.md에서 추출)
    if "check" in sub_reports:
        check_content = sub_reports["check"]
        high_match = re.search(r"HIGH\s*\|\s*(\d+)", check_content)
        med_match = re.search(r"MEDIUM\s*\|\s*(\d+)", check_content)
        low_match = re.search(r"LOW\s*\|\s*(\d+)", check_content)
        if high_match or med_match:
            lines += [
                "",
                "### 검증 이슈 요약",
                "",
                f"- 🔴 HIGH: {high_match.group(1) if high_match else 0}개",
                f"- 🟡 MEDIUM: {med_match.group(1) if med_match else 0}개",
                f"- 🟢 LOW: {low_match.group(1) if low_match else 0}개",
            ]

    lines += [
        "",
        "---",
        "",
        "## GitHub Pages 배포 체크리스트",
        "",
        "GitHub Pages 배포 전 확인 사항:",
        "",
        "- [ ] `index.html`이 레포 루트에 존재",
        "- [ ] 모든 내부 링크가 정상 작동",
        "- [ ] 이미지 경로가 올바름",
        "- [ ] 모바일 반응형 확인 (768px, 480px)",
        "- [ ] `meta viewport` 및 `charset` 선언",
        "- [ ] `og:` 메타 태그 (소셜 미디어 공유)",
        "- [ ] 접근성: alt 속성, ARIA, skip link",
        "- [ ] 성능: 이미지 lazy loading, 폰트 preload",
        "- [ ] 브라우저 콘솔 에러 없음",
        "",
        "### 배포 명령",
        "",
        "```bash",
        "# GitHub Pages는 main 브랜치 루트 또는 /docs 폴더를",
        "# Settings > Pages 에서 설정",
        "",
        "git add -A",
        'git commit -m "chore: update via agent pipeline"',
        "git push origin main",
        "```",
        "",
        "---",
        "",
        "## 서브 리포트 링크",
        "",
        "- [분석 리포트](analysis.md)",
        "- [스킬 리포트](skills.md)",
        "- [구조 리포트](structure.md)",
        "- [검증 리포트](check.md)",
        "",
        "---",
        "",
        "_이 리포트는 `agents/05_publish.py`에 의해 자동 생성되었습니다._",
    ]

    return "\n".join(lines)


# ─── 상세 문서 생성 ───────────────────────────────────────────────────────────

def generate_docs(root: Path):
    """docs/ 디렉토리에 상세 문서 생성."""
    docs_dir = root / "docs"
    docs_dir.mkdir(exist_ok=True)

    # agents.md
    agents_doc = """\
# 에이전트 시스템 가이드

## 개요

Re-Archive 레포지토리는 5개의 자동화 에이전트로 관리됩니다.
각 에이전트는 독립적으로 실행하거나 파이프라인으로 연결하여 사용할 수 있습니다.

---

## 에이전트 상세

### 01_analyze.py — 레포지토리 분석 에이전트

파일 구조, 코드 품질, 참조 관계를 분석하여 `reports/analysis.md`를 생성합니다.

```bash
python3 agents/01_analyze.py           # 기본 실행
python3 agents/01_analyze.py -v        # 상세 로그
python3 agents/01_analyze.py --json    # JSON도 함께 저장
```

**출력**: `reports/analysis.md`, `reports/analysis.json` (선택)

---

### 02_find_skills.py — 스킬 발굴 & 생성 에이전트

누락된 JavaScript/CSS 기능을 탐지하고 코드를 자동 생성합니다.

```bash
python3 agents/02_find_skills.py              # 자동 탐지 후 생성
python3 agents/02_find_skills.py --dry-run    # 탐지만 (생성 안함)
python3 agents/02_find_skills.py --skill whatif nav  # 특정 스킬만
```

**생성 가능한 스킬**:
| 스킬 키 | 파일 | 설명 |
|--------|------|------|
| `whatif` | `js/whatif.js` | What-if 카테고리 필터 |
| `contact` | `js/contact.js` | 연락처 폼 유효성 검사 |
| `nav` | `js/nav.js` | 모바일 햄버거 메뉴 |
| `lightbox` | `js/lightbox.js` | 이미지 라이트박스 |
| `utils_css` | `css/utils.css` | 유틸리티 CSS 클래스 |

---

### 03_improve_structure.py — 구조 개선 에이전트

파일을 적절한 디렉토리로 재배치하고 HTML 경로를 업데이트합니다.

```bash
python3 agents/03_improve_structure.py            # 실행
python3 agents/03_improve_structure.py --dry-run  # 미리보기
python3 agents/03_improve_structure.py --rollback # 롤백
```

**개선 내용**:
- `js/` 디렉토리 생성 및 JS 파일 이동
- `css/` 디렉토리 생성
- `assets/images/` 디렉토리 생성 및 이미지 복사
- HTML 내 경로 참조 자동 업데이트

---

### 04_check.py — 검증 에이전트

HTML, JavaScript, CSS의 품질과 접근성, 보안을 검사합니다.

```bash
python3 agents/04_check.py                  # 전체 검사
python3 agents/04_check.py -v               # 상세 출력
python3 agents/04_check.py --only html css  # 특정 검사만
python3 agents/04_check.py --fail-on-high   # CI 사용 (HIGH 시 exit 1)
```

**검사 항목**: HTML 구조, 깨진 링크, SEO, 접근성(WCAG), 보안, 성능

---

### 05_publish.py — 배포 & 문서화 에이전트

README, CHANGELOG, 통합 요약 리포트를 자동으로 업데이트합니다.

```bash
python3 agents/05_publish.py               # 문서화
python3 agents/05_publish.py --dry-run     # 미리보기
python3 agents/05_publish.py --push        # git commit & push
python3 agents/05_publish.py --update-readme  # README만
python3 agents/05_publish.py --summary     # 요약만
```

---

## 전체 파이프라인

```bash
#!/bin/bash
# run_agents.sh - 전체 에이전트 파이프라인

cd "$(git rev-parse --show-toplevel)"

echo "=== Re-Archive Agent Pipeline ==="
python3 agents/01_analyze.py    && echo "✓ 01 분석 완료"
python3 agents/02_find_skills.py && echo "✓ 02 스킬 생성 완료"
python3 agents/03_improve_structure.py && echo "✓ 03 구조 개선 완료"
python3 agents/04_check.py      && echo "✓ 04 검증 완료"
python3 agents/05_publish.py    && echo "✓ 05 문서화 완료"
echo "=== 파이프라인 완료 ==="
```

---

_이 문서는 `agents/05_publish.py`에 의해 자동 생성됩니다._
"""
    (docs_dir / "agents.md").write_text(agents_doc, encoding="utf-8")

    # skills.md
    skills_doc = """\
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
"""
    (docs_dir / "skills.md").write_text(skills_doc, encoding="utf-8")


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Re-Archive 배포 & 문서화 에이전트")
    parser.add_argument("--dry-run", "-n", action="store_true", help="실제 파일 저장 안함")
    parser.add_argument("--push", action="store_true", help="git commit & push")
    parser.add_argument("--update-readme", action="store_true", help="README만 업데이트")
    parser.add_argument("--summary", action="store_true", help="통합 요약만 생성")
    args = parser.parse_args()

    print("\n🚀 Publish & Documentation Agent")
    print("=" * 50)
    if args.dry_run:
        print("  ⚠ DRY-RUN 모드")
    print()

    # git 정보 수집
    print("[1/5] Git 정보 수집 중...")
    git_info = get_git_info()
    print(f"      → 브랜치: {git_info['branch']} | 커밋: {git_info['commit_hash']}")

    # 프로젝트 정보 수집
    print("[2/5] 프로젝트 정보 수집 중...")
    project_info = collect_project_info(ROOT)
    print(f"      → {project_info['total_files']}개 파일 / {project_info['total_lines']:,}줄")

    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    written = []

    # README 업데이트
    if not args.summary:
        print("[3/5] README.md 생성 중...")
        readme = generate_readme(git_info, project_info)
        if not args.dry_run:
            (ROOT / "README.md").write_text(readme, encoding="utf-8")
            written.append("README.md")
        print(f"      → {len(readme.splitlines())}줄")

        # CHANGELOG
        print("[4/5] CHANGELOG.md 생성 중...")
        changelog = generate_changelog(git_info)
        if not args.dry_run:
            (ROOT / "CHANGELOG.md").write_text(changelog, encoding="utf-8")
            written.append("CHANGELOG.md")
        print(f"      → {len(changelog.splitlines())}줄")

        # docs/ 생성
        if not args.update_readme:
            generate_docs(ROOT)
            written += ["docs/agents.md", "docs/skills.md"]
            print("      → docs/ 문서 생성")
    else:
        print("[3/5] README/CHANGELOG 생략 (--summary 모드)")
        print("[4/5] docs/ 생략 (--summary 모드)")

    # 통합 요약 리포트
    print("[5/5] 통합 요약 리포트 생성 중...")
    summary = generate_summary(git_info, project_info)
    if not args.dry_run:
        (REPORTS_DIR / "summary.md").write_text(summary, encoding="utf-8")
        written.append("reports/summary.md")
    print(f"      → {len(summary.splitlines())}줄")

    # git push (선택)
    if args.push and not args.dry_run:
        print("\n📤 Git commit & push 중...")
        rc, out = git("add", "-A")
        rc, out = git("commit", "-m", f"docs: auto-update via agent pipeline [{git_info['commit_hash']}]")
        if rc == 0:
            branch = git_info["branch"]
            rc2, out2 = git("push", "-u", "origin", branch)
            if rc2 == 0:
                print(f"  ✓ Push 완료 → {branch}")
            else:
                print(f"  ✗ Push 실패: {out2}")
        else:
            print(f"  ℹ commit 결과: {out}")

    print(f"\n{'=' * 50}")
    print("✅ 완료")
    for f in written:
        print(f"   📄 {f}")
    print()


if __name__ == "__main__":
    main()
