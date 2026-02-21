#!/usr/bin/env python3
"""
Agent 01: Repository Analysis Agent
====================================
Re-Archive (goodcafe) 레포지토리를 분석하여:
- 파일 구조 및 의존성 매핑
- 누락된 파일/기능 감지
- 코드 품질 이슈 리포트
- 분석 결과를 reports/analysis.md로 저장

Usage:
    python3 agents/01_analyze.py
    python3 agents/01_analyze.py --verbose
    python3 agents/01_analyze.py --output reports/custom.md
"""

import os
import re
import sys
import json
import argparse
from pathlib import Path
from datetime import datetime
from collections import defaultdict


# ─── 설정 ─────────────────────────────────────────────────────────────────────

ROOT = Path(__file__).parent.parent
REPORTS_DIR = ROOT / "reports"
OUTPUT_FILE = REPORTS_DIR / "analysis.md"

IGNORE_DIRS = {".git", "node_modules", "__pycache__", ".jekyll-cache", "_site"}
IGNORE_FILES = {".DS_Store", "Thumbs.db", ".gitignore"}

# 분석 대상 확장자 → 카테고리
EXT_CATEGORIES = {
    ".html": "HTML",
    ".css": "CSS",
    ".js": "JavaScript",
    ".md": "Markdown",
    ".json": "JSON",
    ".py": "Python",
    ".sh": "Shell",
    ".jpg": "Image",
    ".jpeg": "Image",
    ".png": "Image",
    ".gif": "Image",
    ".svg": "Image",
    ".webp": "Image",
    ".webm": "Video",
    ".mp4": "Video",
    ".woff": "Font",
    ".woff2": "Font",
    ".ttf": "Font",
}


# ─── 유틸리티 ──────────────────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO", verbose: bool = True):
    if verbose or level in ("WARN", "ERROR"):
        icons = {"INFO": "ℹ", "WARN": "⚠", "ERROR": "✗", "OK": "✓"}
        print(f"  {icons.get(level, '·')} {msg}")


def count_lines(path: Path) -> int:
    try:
        return sum(1 for _ in path.open("r", encoding="utf-8", errors="ignore"))
    except Exception:
        return 0


# ─── 파일 스캔 ────────────────────────────────────────────────────────────────

def scan_files(root: Path, verbose: bool = False) -> list[dict]:
    """루트에서 모든 파일을 재귀 스캔하여 메타데이터 반환."""
    results = []
    for path in sorted(root.rglob("*")):
        # 무시할 디렉토리/파일 건너뜀
        if any(part in IGNORE_DIRS for part in path.parts):
            continue
        if path.name in IGNORE_FILES:
            continue
        if not path.is_file():
            continue

        rel = path.relative_to(root)
        ext = path.suffix.lower()
        stat = path.stat()

        entry = {
            "path": str(rel),
            "abs": path,
            "ext": ext,
            "category": EXT_CATEGORIES.get(ext, "Other"),
            "size_bytes": stat.st_size,
            "lines": count_lines(path) if ext in (".html", ".css", ".js", ".md", ".py", ".sh", ".json") else 0,
        }
        results.append(entry)
        log(f"Scanned: {rel} ({entry['category']}, {entry['lines']} lines)", verbose=verbose)

    return results


# ─── HTML 분석 ────────────────────────────────────────────────────────────────

def analyze_html(files: list[dict], root: Path) -> dict:
    """HTML 파일에서 링크, 스크립트, 이미지 참조를 추출하고 누락 확인."""
    issues = []
    references = {"scripts": [], "styles": [], "images": [], "links": [], "partials": []}

    html_files = [f for f in files if f["ext"] == ".html"]

    for f in html_files:
        content = f["abs"].read_text(encoding="utf-8", errors="ignore")
        fpath = f["path"]

        # src 참조 (script, img)
        for match in re.finditer(r'(?:src|href)\s*=\s*["\']([^"\']+)["\']', content):
            ref = match.group(1)
            if ref.startswith(("http", "//", "#", "mailto:")):
                continue  # 외부 링크 무시

            ext = Path(ref).suffix.lower()
            category = EXT_CATEGORIES.get(ext, "")

            if category == "JavaScript":
                references["scripts"].append((fpath, ref))
            elif category == "CSS":
                references["styles"].append((fpath, ref))
            elif category == "Image":
                references["images"].append((fpath, ref))
            elif ext == ".html":
                if "partials/" in ref:
                    references["partials"].append((fpath, ref))
                else:
                    references["links"].append((fpath, ref))

        # fetch() 호출로 로드되는 partial
        for match in re.finditer(r'fetch\s*\(\s*["\']([^"\']+\.html)["\']', content):
            ref = match.group(1)
            references["partials"].append((fpath, f"fetch:{ref}"))

    # 누락 파일 확인
    all_refs = (
        references["scripts"]
        + references["styles"]
        + references["images"]
        + references["links"]
        + references["partials"]
    )
    existing_paths = {f["path"] for f in files}

    for src_file, ref in all_refs:
        clean_ref = ref.replace("fetch:", "")
        # 상대 경로 해석: src_file 기준 OR root 기준 시도
        candidates = [
            clean_ref.lstrip("/"),
            str(Path(src_file).parent / clean_ref),
        ]
        found = any(c in existing_paths for c in candidates)
        if not found:
            issues.append({
                "type": "missing_file",
                "severity": "HIGH",
                "source": src_file,
                "ref": clean_ref,
                "message": f"참조된 파일이 존재하지 않음: `{clean_ref}` (in `{src_file}`)",
            })

    # TODO 주석 수집
    todo_pattern = re.compile(r"<!--\s*(TODO|FIXME|HACK|XXX)[:\s](.+?)-->", re.IGNORECASE)
    for f in html_files:
        content = f["abs"].read_text(encoding="utf-8", errors="ignore")
        for m in todo_pattern.finditer(content):
            issues.append({
                "type": "todo",
                "severity": "LOW",
                "source": f["path"],
                "ref": None,
                "message": f"{m.group(1)}: {m.group(2).strip()} (in `{f['path']}`)",
            })

    return {"issues": issues, "references": references}


# ─── JS 분석 ─────────────────────────────────────────────────────────────────

def analyze_js(files: list[dict]) -> dict:
    """JavaScript 파일에서 패턴 및 이슈 분석."""
    issues = []
    js_files = [f for f in files if f["ext"] == ".js"]

    patterns_found = []
    for f in js_files:
        content = f["abs"].read_text(encoding="utf-8", errors="ignore")

        # 오래된 패턴 탐지
        if "var " in content:
            issues.append({
                "type": "old_syntax",
                "severity": "LOW",
                "source": f["path"],
                "ref": None,
                "message": f"`var` 사용 감지 (let/const 권장): `{f['path']}`",
            })

        # console.log 탐지 (프로덕션에서 제거 권장)
        console_count = len(re.findall(r"\bconsole\.(log|warn|error)\b", content))
        if console_count > 0:
            issues.append({
                "type": "debug_code",
                "severity": "LOW",
                "source": f["path"],
                "ref": None,
                "message": f"console 호출 {console_count}개 발견 (프로덕션 제거 권장): `{f['path']}`",
            })

        # 좋은 패턴 탐지
        if "IntersectionObserver" in content:
            patterns_found.append(("IntersectionObserver", f["path"]))
        if "prefers-reduced-motion" in content:
            patterns_found.append(("ReducedMotion", f["path"]))
        if "DOMContentLoaded" in content:
            patterns_found.append(("DOMContentLoaded", f["path"]))

    return {"issues": issues, "patterns": patterns_found}


# ─── CSS 분석 ─────────────────────────────────────────────────────────────────

def analyze_css(files: list[dict]) -> dict:
    """CSS 파일에서 패턴 및 이슈 분석."""
    issues = []
    css_files = [f for f in files if f["ext"] == ".css"]
    features = []

    for f in css_files:
        content = f["abs"].read_text(encoding="utf-8", errors="ignore")

        # 좋은 CSS 패턴
        for feature in ["clamp(", "var(--", "grid-template", "IntersectionObserver", "@keyframes", "prefers-reduced-motion"]:
            if feature in content:
                features.append((feature, f["path"]))

        # 잠재적 이슈: !important 남용
        important_count = content.count("!important")
        if important_count > 3:
            issues.append({
                "type": "css_specificity",
                "severity": "LOW",
                "source": f["path"],
                "ref": None,
                "message": f"`!important` {important_count}회 사용 (최소화 권장): `{f['path']}`",
            })

        # 구형 flexbox 접두사
        if "-webkit-flex" in content or "-ms-flex" in content:
            issues.append({
                "type": "vendor_prefix",
                "severity": "LOW",
                "source": f["path"],
                "ref": None,
                "message": f"구형 vendor prefix 사용: `{f['path']}`",
            })

    return {"issues": issues, "features": features}


# ─── 구조 분석 ────────────────────────────────────────────────────────────────

def analyze_structure(files: list[dict], root: Path) -> dict:
    """디렉토리 구조 분석 및 권장 구조와 비교."""
    issues = []
    dirs = defaultdict(list)

    for f in files:
        parts = Path(f["path"]).parts
        top = parts[0] if len(parts) > 1 else "(root)"
        dirs[top].append(f)

    # 권장 파일 존재 여부 체크
    recommended = {
        "index.html": "메인 진입점",
        "styles/styles.css": "메인 CSS",
        "main.js": "메인 JavaScript",
        "partials/header.html": "헤더 컴포넌트",
        "partials/footer.html": "푸터 컴포넌트",
        "README.md": "프로젝트 문서",
    }
    existing = {f["path"] for f in files}
    for rec_path, desc in recommended.items():
        if rec_path not in existing:
            issues.append({
                "type": "missing_recommended",
                "severity": "MEDIUM",
                "source": None,
                "ref": rec_path,
                "message": f"권장 파일 없음: `{rec_path}` ({desc})",
            })

    # js/, css/ 디렉토리 없이 루트에 JS 파일 존재
    root_js = [f for f in files if f["ext"] == ".js" and "/" not in f["path"]]
    if root_js and "js" not in dirs:
        issues.append({
            "type": "structure",
            "severity": "MEDIUM",
            "source": None,
            "ref": None,
            "message": f"JS 파일({len(root_js)}개)이 루트에 위치 - `js/` 디렉토리로 이동 권장",
        })

    return {"issues": issues, "dirs": dict(dirs)}


# ─── 리포트 생성 ──────────────────────────────────────────────────────────────

def generate_report(
    files: list[dict],
    html_result: dict,
    js_result: dict,
    css_result: dict,
    struct_result: dict,
    root: Path,
) -> str:
    """분석 결과를 Markdown 리포트로 변환."""

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    total_issues = (
        html_result["issues"] + js_result["issues"] + css_result["issues"] + struct_result["issues"]
    )
    high = [i for i in total_issues if i["severity"] == "HIGH"]
    medium = [i for i in total_issues if i["severity"] == "MEDIUM"]
    low = [i for i in total_issues if i["severity"] == "LOW"]

    # 카테고리별 통계
    cat_stats = defaultdict(lambda: {"count": 0, "lines": 0, "size": 0})
    for f in files:
        cat = f["category"]
        cat_stats[cat]["count"] += 1
        cat_stats[cat]["lines"] += f["lines"]
        cat_stats[cat]["size"] += f["size_bytes"]

    lines = [
        f"# Re-Archive 레포지토리 분석 리포트",
        f"",
        f"> 생성일시: {now}  ",
        f"> 분석 에이전트: `agents/01_analyze.py`",
        f"",
        f"---",
        f"",
        f"## 요약",
        f"",
        f"| 항목 | 값 |",
        f"|------|-----|",
        f"| 총 파일 수 | {len(files)}개 |",
        f"| 총 코드 라인 | {sum(f['lines'] for f in files):,}줄 |",
        f"| 총 크기 | {sum(f['size_bytes'] for f in files) / 1024:.1f} KB |",
        f"| 발견된 이슈 | 🔴 HIGH {len(high)} / 🟡 MEDIUM {len(medium)} / 🟢 LOW {len(low)} |",
        f"",
        f"---",
        f"",
        f"## 파일 구조",
        f"",
        f"```",
        f"{root.name}/",
    ]

    # 트리 형태 출력
    dirs = defaultdict(list)
    root_files = []
    for f in sorted(files, key=lambda x: x["path"]):
        parts = Path(f["path"]).parts
        if len(parts) == 1:
            root_files.append(f)
        else:
            dirs[parts[0]].append(f)

    for f in root_files:
        lines.append(f"├── {f['path']}")

    dir_list = sorted(dirs.keys())
    for i, d in enumerate(dir_list):
        prefix = "└──" if i == len(dir_list) - 1 else "├──"
        lines.append(f"{prefix} {d}/")
        dir_files = sorted(dirs[d], key=lambda x: x["path"])
        for j, f in enumerate(dir_files):
            fname = Path(f["path"]).name
            sub_prefix = "    └──" if j == len(dir_files) - 1 else "    ├──"
            lines.append(f"{sub_prefix} {fname}")

    lines += [
        f"```",
        f"",
        f"---",
        f"",
        f"## 카테고리별 통계",
        f"",
        f"| 카테고리 | 파일 수 | 총 라인 | 총 크기 |",
        f"|---------|--------|--------|--------|",
    ]
    for cat, stats in sorted(cat_stats.items()):
        size_str = f"{stats['size'] / 1024:.1f} KB" if stats["size"] > 1024 else f"{stats['size']} B"
        lines.append(f"| {cat} | {stats['count']} | {stats['lines']:,} | {size_str} |")

    lines += [
        f"",
        f"---",
        f"",
        f"## HTML 참조 분석",
        f"",
    ]

    refs = html_result["references"]
    for ref_type, ref_list in refs.items():
        if ref_list:
            lines.append(f"### {ref_type.capitalize()} ({len(ref_list)}개)")
            for src, ref in ref_list[:10]:  # 최대 10개 표시
                lines.append(f"- `{ref}` ← `{src}`")
            if len(ref_list) > 10:
                lines.append(f"- _(외 {len(ref_list) - 10}개)_")
            lines.append("")

    lines += [
        f"---",
        f"",
        f"## JavaScript 패턴 분석",
        f"",
        f"### 발견된 현대적 패턴",
        f"",
    ]
    for pattern, fpath in js_result["patterns"]:
        lines.append(f"- ✅ `{pattern}` in `{fpath}`")

    lines += [
        f"",
        f"---",
        f"",
        f"## CSS 기능 분석",
        f"",
        f"### 발견된 현대적 CSS 기능",
        f"",
    ]
    for feature, fpath in css_result["features"]:
        lines.append(f"- ✅ `{feature}` in `{fpath}`")

    lines += [
        f"",
        f"---",
        f"",
        f"## 발견된 이슈",
        f"",
    ]

    if not total_issues:
        lines.append("이슈가 발견되지 않았습니다. ✅")
    else:
        for severity, color, issues_list in [
            ("HIGH", "🔴", high),
            ("MEDIUM", "🟡", medium),
            ("LOW", "🟢", low),
        ]:
            if issues_list:
                lines.append(f"### {color} {severity} ({len(issues_list)}개)")
                lines.append("")
                for issue in issues_list:
                    lines.append(f"- **[{issue['type']}]** {issue['message']}")
                lines.append("")

    lines += [
        f"---",
        f"",
        f"## 권장 개선 사항",
        f"",
        f"에이전트 시스템을 통해 자동으로 수행할 수 있는 개선 사항:",
        f"",
        f"1. **`02_find_skills.py`** - 누락된 기능(whatif.js, contact form 등) 자동 생성",
        f"2. **`03_improve_structure.py`** - 폴더 구조 재편성 (`js/`, `css/`, `assets/` 분리)",
        f"3. **`04_check.py`** - HTML 유효성, 깨진 링크, 접근성 검사",
        f"4. **`05_publish.py`** - README 업데이트 및 GitHub Pages 배포",
        f"",
        f"---",
        f"",
        f"_이 리포트는 `agents/01_analyze.py`에 의해 자동 생성되었습니다._",
    ]

    return "\n".join(lines)


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Re-Archive 레포지토리 분석 에이전트")
    parser.add_argument("--verbose", "-v", action="store_true", help="상세 로그 출력")
    parser.add_argument("--output", "-o", default=str(OUTPUT_FILE), help="리포트 출력 경로")
    parser.add_argument("--json", action="store_true", help="JSON 형식으로도 출력")
    args = parser.parse_args()

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    print("\n🔍 Re-Archive Repository Analysis Agent")
    print("=" * 50)

    # 1. 파일 스캔
    print("\n[1/5] 파일 스캔 중...")
    files = scan_files(ROOT, verbose=args.verbose)
    print(f"      → {len(files)}개 파일 발견")

    # 2. HTML 분석
    print("\n[2/5] HTML 분석 중...")
    html_result = analyze_html(files, ROOT)
    print(f"      → HTML 이슈 {len(html_result['issues'])}개 발견")

    # 3. JS 분석
    print("\n[3/5] JavaScript 분석 중...")
    js_result = analyze_js(files)
    print(f"      → JS 이슈 {len(js_result['issues'])}개 발견")

    # 4. CSS 분석
    print("\n[4/5] CSS 분석 중...")
    css_result = analyze_css(files)
    print(f"      → CSS 이슈 {len(css_result['issues'])}개 발견")

    # 5. 구조 분석
    print("\n[5/5] 디렉토리 구조 분석 중...")
    struct_result = analyze_structure(files, ROOT)
    print(f"      → 구조 이슈 {len(struct_result['issues'])}개 발견")

    # 리포트 생성
    print(f"\n📄 리포트 생성 중 → {output_path}")
    report = generate_report(files, html_result, js_result, css_result, struct_result, ROOT)
    output_path.write_text(report, encoding="utf-8")
    print(f"   ✓ 저장 완료: {output_path}")

    # JSON 출력 (선택)
    if args.json:
        json_path = output_path.with_suffix(".json")
        data = {
            "files": [{k: v for k, v in f.items() if k != "abs"} for f in files],
            "html": {**html_result, "references": {k: list(v) for k, v in html_result["references"].items()}},
            "js": js_result,
            "css": css_result,
            "structure": struct_result,
        }
        json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"   ✓ JSON 저장: {json_path}")

    # 요약 출력
    all_issues = html_result["issues"] + js_result["issues"] + css_result["issues"] + struct_result["issues"]
    high = sum(1 for i in all_issues if i["severity"] == "HIGH")
    medium = sum(1 for i in all_issues if i["severity"] == "MEDIUM")
    low = sum(1 for i in all_issues if i["severity"] == "LOW")

    print(f"\n{'=' * 50}")
    print(f"✅ 분석 완료")
    print(f"   파일: {len(files)}개 | 이슈: 🔴{high} / 🟡{medium} / 🟢{low}")
    print(f"   리포트: {output_path}")
    print()


if __name__ == "__main__":
    main()
