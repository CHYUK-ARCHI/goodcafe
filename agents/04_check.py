#!/usr/bin/env python3
"""
Agent 04: Check & Validation Agent
=====================================
Re-Archive 레포지토리의 품질을 검사합니다:

검사 항목:
  1. HTML 구조 유효성 (기본)
  2. 깨진 내부 링크 / 파일 참조
  3. 접근성 기본 항목 (alt 속성, ARIA, skip link 등)
  4. JavaScript 문법 기본 검사
  5. CSS 잠재적 이슈
  6. 보안 패턴 (inline event handler, unsafe patterns)
  7. SEO 기본 항목 (meta, title, description)
  8. 성능 권장사항 (lazy loading, font preload 등)

Usage:
    python3 agents/04_check.py
    python3 agents/04_check.py --verbose
    python3 agents/04_check.py --fail-on-high   # HIGH 이슈 발견 시 exit(1)
    python3 agents/04_check.py --only html js   # 특정 검사만
"""

import re
import sys
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict


ROOT = Path(__file__).parent.parent
REPORTS_DIR = ROOT / "reports"

IGNORE_DIRS = {".git", "__pycache__", "node_modules", ".structure_backup"}


# ─── 이슈 컨테이너 ────────────────────────────────────────────────────────────

class Issue:
    def __init__(self, severity: str, category: str, file: str, line: int, message: str, suggestion: str = ""):
        self.severity = severity  # HIGH / MEDIUM / LOW / INFO
        self.category = category
        self.file = file
        self.line = line
        self.message = message
        self.suggestion = suggestion

    def __repr__(self):
        loc = f"{self.file}:{self.line}" if self.line else self.file
        return f"[{self.severity}] [{self.category}] {loc}: {self.message}"


# ─── 파일 수집 ────────────────────────────────────────────────────────────────

def collect_files(root: Path, exts: set) -> list[Path]:
    result = []
    for path in sorted(root.rglob("*")):
        if path.is_file() and path.suffix.lower() in exts:
            if not any(part in IGNORE_DIRS for part in path.parts):
                result.append(path)
    return result


# ─── HTML 검사 ────────────────────────────────────────────────────────────────

def check_html(root: Path) -> list[Issue]:
    issues = []
    html_files = collect_files(root, {".html"})
    all_files = {str(p.relative_to(root)) for p in root.rglob("*") if p.is_file()}

    for html_path in html_files:
        rel = str(html_path.relative_to(root))
        content = html_path.read_text(encoding="utf-8", errors="ignore")
        lines = content.splitlines()

        # ── 기본 구조 ──────────────────────────────────────────────────────

        if "<!DOCTYPE html>" not in content and "<!doctype html>" not in content.lower():
            issues.append(Issue("HIGH", "HTML", rel, 1, "DOCTYPE 선언 없음", "파일 첫 줄에 <!DOCTYPE html> 추가"))

        if "<html" not in content:
            issues.append(Issue("HIGH", "HTML", rel, 1, "<html> 태그 없음"))

        if "<head>" not in content and "<head " not in content:
            issues.append(Issue("HIGH", "HTML", rel, 1, "<head> 태그 없음"))

        if "<body>" not in content and "<body " not in content:
            issues.append(Issue("HIGH", "HTML", rel, 1, "<body> 태그 없음"))

        # ── 깨진 참조 ─────────────────────────────────────────────────────

        ref_pattern = re.compile(r'(?:src|href)\s*=\s*["\']([^"\'#?]+)["\']')
        for i, line in enumerate(lines, 1):
            for m in ref_pattern.finditer(line):
                ref = m.group(1)
                if ref.startswith(("http", "//", "mailto:", "tel:", "javascript:", "data:")):
                    continue

                # 상대 경로 → 절대 경로 변환
                base = html_path.parent
                abs_ref = (base / ref).resolve()
                rel_ref = None
                try:
                    rel_ref = str(abs_ref.relative_to(root))
                except ValueError:
                    pass

                if rel_ref and rel_ref not in all_files and not abs_ref.exists():
                    issues.append(Issue(
                        "HIGH", "BrokenLink", rel, i,
                        f"참조 파일 없음: `{ref}`",
                        f"파일을 생성하거나 경로를 수정하세요: {ref}"
                    ))

        # ── SEO ───────────────────────────────────────────────────────────

        if "<title>" not in content:
            issues.append(Issue("MEDIUM", "SEO", rel, 0, "<title> 태그 없음", "<head>에 <title> 추가"))

        if 'name="description"' not in content:
            issues.append(Issue("LOW", "SEO", rel, 0, "meta description 없음",
                                '<meta name="description" content="..."> 추가'))

        if 'property="og:' not in content and 'name="og:' not in content:
            issues.append(Issue("LOW", "SEO", rel, 0, "Open Graph 태그 없음",
                                "og:title, og:description, og:image 추가 권장"))

        # ── 접근성 ────────────────────────────────────────────────────────

        # img 태그에 alt 없음 확인
        img_pattern = re.compile(r'<img\s[^>]*>', re.IGNORECASE)
        for i, line in enumerate(lines, 1):
            for m in img_pattern.finditer(line):
                tag = m.group(0)
                if 'alt=' not in tag.lower():
                    issues.append(Issue(
                        "HIGH", "A11y", rel, i,
                        f"img 태그에 alt 속성 없음: {tag[:60]}...",
                        'alt="" (장식용) 또는 alt="설명" 추가'
                    ))

        # lang 속성 확인
        if "<html" in content and 'lang=' not in content:
            issues.append(Issue("MEDIUM", "A11y", rel, 1, "<html lang> 속성 없음",
                                '<html lang="ko"> 추가'))

        # skip link 확인 (index.html에만)
        if rel == "index.html" and "skip" not in content.lower() and "#main" not in content:
            issues.append(Issue("LOW", "A11y", rel, 0, "Skip navigation link 없음",
                                '<a href="#main" class="skip-link">본문 바로가기</a> 추가'))

        # form label 확인
        input_pattern = re.compile(r'<input\s[^>]*type=["\'](?!hidden|submit|button|reset|checkbox|radio)[^"\']+["\'][^>]*>', re.IGNORECASE)
        for i, line in enumerate(lines, 1):
            for m in input_pattern.finditer(line):
                tag = m.group(0)
                if 'id=' not in tag.lower() and 'aria-label=' not in tag.lower():
                    issues.append(Issue("MEDIUM", "A11y", rel, i,
                                        f"input에 id 또는 aria-label 없음: {tag[:50]}...",
                                        "id 추가 후 <label for='id'> 연결 또는 aria-label 추가"))

        # ── 보안 ──────────────────────────────────────────────────────────

        # inline event handlers
        inline_events = re.compile(r'\bon\w+\s*=\s*["\'][^"\']*["\']')
        for i, line in enumerate(lines, 1):
            if inline_events.search(line):
                issues.append(Issue("LOW", "Security", rel, i,
                                    "인라인 이벤트 핸들러 사용",
                                    "addEventListener()로 변경 권장"))

        # ── 성능 ──────────────────────────────────────────────────────────

        # img without loading=lazy
        img_no_lazy = re.compile(r'<img\s(?![^>]*loading=)[^>]*>', re.IGNORECASE)
        for i, line in enumerate(lines, 1):
            if img_no_lazy.search(line) and "hero" not in line.lower():
                issues.append(Issue("LOW", "Performance", rel, i,
                                    "img에 loading='lazy' 없음 (히어로 이미지 제외)",
                                    'loading="lazy" 추가 권장'))

        # charset
        if "charset" not in content.lower():
            issues.append(Issue("MEDIUM", "HTML", rel, 0, "charset 선언 없음",
                                '<meta charset="UTF-8"> 추가'))

        # viewport
        if 'name="viewport"' not in content:
            issues.append(Issue("MEDIUM", "HTML", rel, 0, "viewport meta 없음",
                                '<meta name="viewport" content="width=device-width, initial-scale=1"> 추가'))

    return issues


# ─── JavaScript 검사 ──────────────────────────────────────────────────────────

def check_js(root: Path) -> list[Issue]:
    issues = []
    js_files = collect_files(root, {".js"})

    for js_path in js_files:
        rel = str(js_path.relative_to(root))
        content = js_path.read_text(encoding="utf-8", errors="ignore")
        lines = content.splitlines()

        # 리다이렉트 파일 건너뜀
        if "이 파일은" in content and "이동되었습니다" in content:
            continue

        # eval() 사용
        eval_pattern = re.compile(r'\beval\s*\(')
        for i, line in enumerate(lines, 1):
            if eval_pattern.search(line):
                issues.append(Issue("HIGH", "Security", rel, i,
                                    "eval() 사용 - 보안 위험",
                                    "JSON.parse() 또는 다른 안전한 방법으로 대체"))

        # document.write() 사용
        for i, line in enumerate(lines, 1):
            if "document.write(" in line:
                issues.append(Issue("HIGH", "Security", rel, i,
                                    "document.write() 사용",
                                    "DOM API(createElement 등) 사용 권장"))

        # innerHTML에 사용자 입력
        for i, line in enumerate(lines, 1):
            if "innerHTML" in line and ("value" in line or "input" in line or "param" in line):
                issues.append(Issue("MEDIUM", "Security", rel, i,
                                    "innerHTML에 잠재적 사용자 입력 - XSS 위험",
                                    "textContent 또는 DOMPurify 사용"))

        # 전역 변수 감지
        var_pattern = re.compile(r'^(?:var|let|const)\s+\w+', re.MULTILINE)
        if not content.strip().startswith("(") and not "use strict" in content[:200]:
            top_level_vars = var_pattern.findall(content[:500])
            if top_level_vars:
                issues.append(Issue("LOW", "JS", rel, 0,
                                    f"'use strict' 선언 없음 (전역 변수 위험)",
                                    "파일 상단에 'use strict'; 추가 또는 IIFE로 감싸기"))

        # 미완성 TODO/FIXME
        for i, line in enumerate(lines, 1):
            if re.search(r'\b(TODO|FIXME|HACK|XXX)\b', line, re.IGNORECASE):
                note = line.strip()[:80]
                issues.append(Issue("LOW", "Code", rel, i, f"미완성 항목: {note}"))

        # console.log (프로덕션)
        console_pattern = re.compile(r'\bconsole\.(log|debug|info)\b')
        console_count = sum(1 for line in lines if console_pattern.search(line))
        if console_count > 0:
            issues.append(Issue("LOW", "Code", rel, 0,
                                f"console 호출 {console_count}개 (프로덕션 제거 권장)"))

    return issues


# ─── CSS 검사 ─────────────────────────────────────────────────────────────────

def check_css(root: Path) -> list[Issue]:
    issues = []
    css_files = collect_files(root, {".css"})

    for css_path in css_files:
        rel = str(css_path.relative_to(root))
        content = css_path.read_text(encoding="utf-8", errors="ignore")
        lines = content.splitlines()

        # !important 과다 사용
        important_count = content.count("!important")
        if important_count > 5:
            issues.append(Issue("LOW", "CSS", rel, 0,
                                f"!important {important_count}회 사용 (특이도 설계 재검토 권장)"))

        # 구형 vendor prefix
        for i, line in enumerate(lines, 1):
            if re.search(r'-webkit-|-moz-|-ms-|-o-', line):
                issues.append(Issue("LOW", "CSS", rel, i,
                                    f"Vendor prefix 사용: {line.strip()[:60]}",
                                    "Autoprefixer 사용 또는 현대 문법으로 교체 검토"))
                break  # 파일당 1개만 보고

        # 빈 규칙
        empty_rule = re.compile(r'\{[\s]*\}')
        for i, line in enumerate(lines, 1):
            if empty_rule.search(line):
                issues.append(Issue("LOW", "CSS", rel, i,
                                    f"빈 CSS 규칙: {line.strip()}",
                                    "미사용 규칙 제거"))

        # color: #fff vs rgba/custom property
        hardcoded_colors = len(re.findall(r'(?<!--)\bcolor\s*:\s*#[0-9a-fA-F]{3,6}\b', content))
        if hardcoded_colors > 15:
            issues.append(Issue("LOW", "CSS", rel, 0,
                                f"하드코딩된 색상값 {hardcoded_colors}개 (CSS 변수 사용 권장)"))

    return issues


# ─── 파일 존재 검사 ───────────────────────────────────────────────────────────

def check_files(root: Path) -> list[Issue]:
    """권장 파일 및 구조 검사."""
    issues = []

    recommended = [
        ("index.html",              "HIGH",   "메인 진입점 없음"),
        ("README.md",               "MEDIUM", "프로젝트 문서 없음"),
        ("styles/styles.css",       "MEDIUM", "메인 CSS 없음"),
        ("partials/header.html",    "LOW",    "헤더 컴포넌트 없음"),
        ("partials/footer.html",    "LOW",    "푸터 컴포넌트 없음"),
    ]

    for path, severity, message in recommended:
        if not (root / path).exists():
            issues.append(Issue(severity, "Structure", path, 0, message,
                                f"`{path}` 파일 생성 필요"))

    # 스킬 파일 존재 확인
    skill_files = [
        ("js/whatif.js",  "LOW", "What-if 필터 스크립트 없음 (02_find_skills.py 실행 권장)"),
        ("js/nav.js",     "LOW", "모바일 Nav 스크립트 없음"),
        ("css/utils.css", "LOW", "유틸리티 CSS 없음"),
    ]
    for path, severity, message in skill_files:
        if not (root / path).exists():
            issues.append(Issue(severity, "Skills", path, 0, message))

    return issues


# ─── 리포트 생성 ──────────────────────────────────────────────────────────────

def generate_report(all_issues: list[Issue]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    high   = [i for i in all_issues if i.severity == "HIGH"]
    medium = [i for i in all_issues if i.severity == "MEDIUM"]
    low    = [i for i in all_issues if i.severity == "LOW"]
    info   = [i for i in all_issues if i.severity == "INFO"]

    # 카테고리별 집계
    cat_counts = defaultdict(lambda: {"HIGH": 0, "MEDIUM": 0, "LOW": 0, "INFO": 0})
    for issue in all_issues:
        cat_counts[issue.category][issue.severity] += 1

    lines = [
        "# 검증 리포트",
        "",
        f"> 생성일시: {now}  ",
        f"> 에이전트: `agents/04_check.py`",
        "",
        "---",
        "",
        "## 요약",
        "",
        f"| 심각도 | 건수 |",
        f"|--------|------|",
        f"| 🔴 HIGH   | {len(high)} |",
        f"| 🟡 MEDIUM | {len(medium)} |",
        f"| 🟢 LOW    | {len(low)} |",
        f"| ℹ INFO    | {len(info)} |",
        f"| **합계**  | **{len(all_issues)}** |",
        "",
        "---",
        "",
        "## 카테고리별 현황",
        "",
        "| 카테고리 | 🔴 HIGH | 🟡 MEDIUM | 🟢 LOW | ℹ INFO |",
        "|---------|--------|----------|------|------|",
    ]
    for cat, counts in sorted(cat_counts.items()):
        lines.append(f"| {cat} | {counts['HIGH']} | {counts['MEDIUM']} | {counts['LOW']} | {counts['INFO']} |")

    lines += ["", "---", ""]

    for severity, color, issue_list in [
        ("HIGH",   "🔴", high),
        ("MEDIUM", "🟡", medium),
        ("LOW",    "🟢", low),
        ("INFO",   "ℹ",  info),
    ]:
        if not issue_list:
            continue
        lines += [f"## {color} {severity} 이슈 ({len(issue_list)}개)", ""]
        for issue in issue_list:
            loc = f"`{issue.file}:{issue.line}`" if issue.line else f"`{issue.file}`"
            lines.append(f"### [{issue.category}] {issue.message}")
            lines.append(f"- **위치**: {loc}")
            if issue.suggestion:
                lines.append(f"- **권장**: {issue.suggestion}")
            lines.append("")

    lines += [
        "---",
        "",
        "## 다음 단계",
        "",
        "1. 🔴 HIGH 이슈부터 순서대로 수정",
        "2. `agents/02_find_skills.py` 실행으로 누락 스킬 자동 생성",
        "3. `agents/03_improve_structure.py` 실행으로 구조 개선",
        "4. `agents/05_publish.py` 실행으로 배포 및 문서화",
        "",
        "_이 리포트는 `agents/04_check.py`에 의해 자동 생성되었습니다._",
    ]

    return "\n".join(lines)


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Re-Archive 검증 에이전트")
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--fail-on-high", action="store_true", help="HIGH 이슈 시 exit(1)")
    parser.add_argument("--only", nargs="+", choices=["html", "js", "css", "files"],
                        help="특정 검사만 실행")
    args = parser.parse_args()

    checks = args.only or ["html", "js", "css", "files"]

    print("\n✅ Check & Validation Agent")
    print("=" * 50)

    all_issues: list[Issue] = []

    check_map = {
        "html":  ("HTML 검사 중...",    lambda: check_html(ROOT)),
        "js":    ("JS 검사 중...",      lambda: check_js(ROOT)),
        "css":   ("CSS 검사 중...",     lambda: check_css(ROOT)),
        "files": ("파일 구조 검사 중...", lambda: check_files(ROOT)),
    }

    for i, check_name in enumerate(checks, 1):
        label, fn = check_map[check_name]
        print(f"\n[{i}/{len(checks)}] {label}")
        issues = fn()
        all_issues.extend(issues)

        highs  = sum(1 for x in issues if x.severity == "HIGH")
        mediums = sum(1 for x in issues if x.severity == "MEDIUM")
        lows   = sum(1 for x in issues if x.severity == "LOW")
        print(f"      → 🔴{highs} / 🟡{mediums} / 🟢{lows}")

        if args.verbose:
            for issue in issues:
                icon = {"HIGH": "🔴", "MEDIUM": "🟡", "LOW": "🟢", "INFO": "ℹ"}.get(issue.severity, "?")
                loc = f"{issue.file}:{issue.line}" if issue.line else issue.file
                print(f"  {icon} [{issue.category}] {loc}: {issue.message}")

    # 리포트 저장
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report = generate_report(all_issues)
    report_path = REPORTS_DIR / "check.md"
    report_path.write_text(report, encoding="utf-8")

    high_count   = sum(1 for i in all_issues if i.severity == "HIGH")
    medium_count = sum(1 for i in all_issues if i.severity == "MEDIUM")
    low_count    = sum(1 for i in all_issues if i.severity == "LOW")

    print(f"\n{'=' * 50}")
    print(f"📄 리포트: {report_path.relative_to(ROOT)}")
    print(f"   총 이슈: 🔴{high_count} HIGH / 🟡{medium_count} MEDIUM / 🟢{low_count} LOW")

    if high_count == 0 and medium_count == 0:
        print("   ✅ 주요 이슈 없음!")
    else:
        print(f"   ⚠ 수정 필요한 이슈가 있습니다.")

    print()

    if args.fail_on_high and high_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
