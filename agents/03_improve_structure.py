#!/usr/bin/env python3
"""
Agent 03: Folder Structure Improvement Agent
=============================================
Re-Archive 레포지토리의 폴더 구조를 분석하고 개선합니다:

개선 내용:
  1. js/     디렉토리 생성 및 JS 파일 이동
  2. css/    디렉토리 생성 (utils.css 등)
  3. assets/ 디렉토리 생성 및 이미지 이동
  4. docs/   디렉토리 생성 및 문서 정리
  5. HTML 내 경로 참조 자동 업데이트

목표 구조:
  goodcafe/
  ├── index.html
  ├── README.md
  ├── agents/          ← 에이전트 스크립트
  ├── css/             ← 새로 생성
  │   └── utils.css
  ├── js/              ← 새로 생성
  │   ├── main.js      (이동)
  │   ├── whatif.js
  │   ├── nav.js
  │   ├── contact.js
  │   └── lightbox.js
  ├── assets/          ← 새로 생성
  │   └── images/      (이미지 이동)
  ├── pages/
  ├── partials/
  ├── reports/
  └── styles/          (기존 유지)

Usage:
    python3 agents/03_improve_structure.py
    python3 agents/03_improve_structure.py --dry-run
    python3 agents/03_improve_structure.py --rollback
"""

import os
import re
import sys
import json
import shutil
import argparse
from pathlib import Path
from datetime import datetime


ROOT = Path(__file__).parent.parent
REPORTS_DIR = ROOT / "reports"
BACKUP_DIR = ROOT / ".structure_backup"
SNAPSHOT_FILE = BACKUP_DIR / "snapshot.json"


# ─── 개선 계획 정의 ──────────────────────────────────────────────────────────

STRUCTURE_PLAN = {
    "create_dirs": [
        "js",
        "css",
        "assets",
        "assets/images",
        "assets/media",
        "docs",
        "reports",
    ],
    "move_files": [
        # (소스, 대상, 설명)
        ("main.js", "js/main.js", "메인 JS를 js/ 디렉토리로 이동"),
    ],
    "move_dirs": [
        # images/ → assets/images/  (이미지는 이동하지 않고 assets 심볼릭 유지)
    ],
    "path_updates": {
        # HTML 파일별: (구 경로 → 새 경로) 매핑
        "index.html": [
            ("main.js", "js/main.js"),
            ("images/", "assets/images/"),
        ],
        "pages/projects.html": [
            ("../main.js", "../js/main.js"),
            ('href="styles.css"', 'href="../styles/styles.css"'),
            ('"images/', '"../assets/images/'),
        ],
        "pages/what-if.html": [
            ("../main.js", "../js/main.js"),
            ('"images/', '"../assets/images/'),
            ('"whatif.js"', '"../js/whatif.js"'),
        ],
        "partials/header.html": [
            ("../main.js", "../js/main.js"),
        ],
    },
}


# ─── 백업 ─────────────────────────────────────────────────────────────────────

def create_backup(root: Path) -> dict:
    """현재 파일 구조 스냅샷 저장 (롤백용)."""
    BACKUP_DIR.mkdir(exist_ok=True)

    snapshot = {"timestamp": datetime.now().isoformat(), "files": {}}

    for path in sorted(root.rglob("*")):
        if path.is_file() and ".structure_backup" not in str(path) and ".git" not in str(path):
            rel = str(path.relative_to(root))
            snapshot["files"][rel] = path.read_bytes().hex()

    SNAPSHOT_FILE.write_text(json.dumps(snapshot, indent=2), encoding="utf-8")
    return snapshot


def rollback(root: Path):
    """스냅샷에서 이전 구조로 복원."""
    if not SNAPSHOT_FILE.exists():
        print("❌ 백업 스냅샷 없음. 롤백 불가.")
        sys.exit(1)

    snapshot = json.loads(SNAPSHOT_FILE.read_text(encoding="utf-8"))
    print(f"⏪ 롤백 시작 (백업: {snapshot['timestamp']})")

    for rel, hex_content in snapshot["files"].items():
        target = root / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(bytes.fromhex(hex_content))
        print(f"  ✓ 복원: {rel}")

    print("✅ 롤백 완료")


# ─── 디렉토리 생성 ───────────────────────────────────────────────────────────

def create_directories(root: Path, dirs: list[str], dry_run: bool) -> list[dict]:
    results = []
    for d in dirs:
        target = root / d
        if target.exists():
            results.append({"action": "mkdir", "path": d, "status": "exists"})
        else:
            if not dry_run:
                target.mkdir(parents=True, exist_ok=True)
                # .gitkeep 파일 생성 (빈 디렉토리 git 추적용)
                (target / ".gitkeep").touch()
            results.append({"action": "mkdir", "path": d, "status": "dry_run" if dry_run else "created"})
    return results


# ─── 파일 이동 ────────────────────────────────────────────────────────────────

def move_files(root: Path, moves: list[tuple], dry_run: bool) -> list[dict]:
    results = []
    for src_rel, dst_rel, desc in moves:
        src = root / src_rel
        dst = root / dst_rel

        if not src.exists():
            results.append({"action": "move", "src": src_rel, "dst": dst_rel, "status": "src_missing", "desc": desc})
            continue

        if dst.exists():
            results.append({"action": "move", "src": src_rel, "dst": dst_rel, "status": "dst_exists", "desc": desc})
            continue

        if not dry_run:
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, dst)  # 복사 후 원본 유지 (안전한 이동)
            # 원본에 리다이렉트 주석 파일 생성 (하위 호환성)
            if src.suffix == ".js":
                src.write_text(
                    f'/* Re-Archive: 이 파일은 {dst_rel}로 이동되었습니다. */\n'
                    f'/* This file moved to {dst_rel} */\n'
                    f'import("{dst_rel.split("/")[-1]}");\n',
                    encoding="utf-8"
                )

        results.append({"action": "move", "src": src_rel, "dst": dst_rel, "status": "dry_run" if dry_run else "moved", "desc": desc})
    return results


# ─── 이미지 디렉토리 동기화 ──────────────────────────────────────────────────

def sync_images(root: Path, dry_run: bool) -> list[dict]:
    """images/ 내용을 assets/images/로 복사 (원본 유지)."""
    results = []
    src_dir = root / "images"
    dst_dir = root / "assets" / "images"

    if not src_dir.exists():
        return results

    if not dry_run:
        dst_dir.mkdir(parents=True, exist_ok=True)

    for img in sorted(src_dir.iterdir()):
        if img.is_file() and img.name != ".gitkeep":
            dst = dst_dir / img.name
            if not dst.exists():
                if not dry_run:
                    shutil.copy2(img, dst)
                results.append({
                    "action": "sync_image",
                    "src": f"images/{img.name}",
                    "dst": f"assets/images/{img.name}",
                    "status": "dry_run" if dry_run else "copied"
                })
            else:
                results.append({
                    "action": "sync_image",
                    "src": f"images/{img.name}",
                    "dst": f"assets/images/{img.name}",
                    "status": "exists"
                })

    return results


# ─── HTML 경로 업데이트 ───────────────────────────────────────────────────────

def update_html_paths(root: Path, updates: dict, dry_run: bool) -> list[dict]:
    """HTML 파일 내의 경로 참조를 새 구조에 맞게 업데이트."""
    results = []

    for html_rel, replacements in updates.items():
        html_path = root / html_rel

        if not html_path.exists():
            results.append({"action": "update_path", "file": html_rel, "status": "file_missing"})
            continue

        content = html_path.read_text(encoding="utf-8")
        original = content
        changes = []

        for old, new in replacements:
            # 이미 새 경로가 포함된 경우 중복 치환 방지
            if old in content and new not in content:
                content = content.replace(old, new)
                changes.append((old, new))

        if changes and not dry_run:
            html_path.write_text(content, encoding="utf-8")

        results.append({
            "action": "update_path",
            "file": html_rel,
            "status": "dry_run" if dry_run else ("updated" if changes else "no_change"),
            "changes": changes,
        })

    return results


# ─── 구조 트리 생성 ───────────────────────────────────────────────────────────

def build_tree(root: Path, ignore: set = None) -> str:
    """현재 디렉토리 구조를 트리 형태 문자열로 반환."""
    ignore = ignore or {".git", "__pycache__", ".structure_backup", "node_modules"}
    lines = [f"{root.name}/"]

    def _tree(path: Path, prefix: str = ""):
        entries = sorted(
            [e for e in path.iterdir() if e.name not in ignore],
            key=lambda e: (e.is_file(), e.name)
        )
        for i, entry in enumerate(entries):
            is_last = (i == len(entries) - 1)
            connector = "└── " if is_last else "├── "
            lines.append(f"{prefix}{connector}{entry.name}{'/' if entry.is_dir() else ''}")
            if entry.is_dir():
                extension = "    " if is_last else "│   "
                _tree(entry, prefix + extension)

    _tree(root)
    return "\n".join(lines)


# ─── 리포트 저장 ─────────────────────────────────────────────────────────────

def save_report(all_results: list[dict], root: Path, dry_run: bool):
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    report_path = REPORTS_DIR / "structure.md"
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    status_counts = {}
    for r in all_results:
        s = r.get("status", "unknown")
        status_counts[s] = status_counts.get(s, 0) + 1

    lines = [
        "# 폴더 구조 개선 리포트",
        "",
        f"> 생성일시: {now}  ",
        f"> 모드: {'🔍 DRY-RUN (미적용)' if dry_run else '✅ 적용됨'}  ",
        f"> 에이전트: `agents/03_improve_structure.py`",
        "",
        "---",
        "",
        "## 작업 요약",
        "",
        "| 상태 | 건수 |",
        "|------|------|",
    ]
    for status, count in sorted(status_counts.items()):
        icons = {"created": "✅", "moved": "📦", "copied": "📋", "dry_run": "👁",
                 "exists": "⏭", "src_missing": "❌", "updated": "✏️", "no_change": "—"}
        lines.append(f"| {icons.get(status, '?')} {status} | {count} |")

    lines += [
        "",
        "---",
        "",
        "## 작업 상세",
        "",
    ]

    action_groups = {}
    for r in all_results:
        action = r.get("action", "unknown")
        action_groups.setdefault(action, []).append(r)

    action_labels = {
        "mkdir": "디렉토리 생성",
        "move": "파일 이동",
        "sync_image": "이미지 동기화",
        "update_path": "HTML 경로 업데이트",
    }

    for action, items in action_groups.items():
        label = action_labels.get(action, action)
        lines += [f"### {label}", ""]
        for item in items:
            status = item.get("status", "?")
            icon = {"created": "✅", "moved": "📦", "copied": "📋", "dry_run": "👁",
                    "exists": "⏭", "src_missing": "❌", "updated": "✏️", "no_change": "—"}.get(status, "?")

            if action == "mkdir":
                lines.append(f"- {icon} `{item['path']}/`")
            elif action == "move":
                lines.append(f"- {icon} `{item['src']}` → `{item['dst']}` _{item.get('desc', '')}_")
            elif action == "sync_image":
                lines.append(f"- {icon} `{item['src']}` → `{item['dst']}`")
            elif action == "update_path":
                changes = item.get("changes", [])
                if changes:
                    lines.append(f"- {icon} `{item['file']}`:")
                    for old, new in changes:
                        lines.append(f"  - `{old}` → `{new}`")
                else:
                    lines.append(f"- {icon} `{item['file']}` (변경 없음)")
        lines.append("")

    lines += [
        "---",
        "",
        "## 개선 후 구조",
        "",
        "```",
        build_tree(root),
        "```",
        "",
        "---",
        "",
        "_이 리포트는 `agents/03_improve_structure.py`에 의해 자동 생성되었습니다._",
    ]

    report_path.write_text("\n".join(lines), encoding="utf-8")
    return report_path


# ─── 메인 ────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Re-Archive 폴더 구조 개선 에이전트")
    parser.add_argument("--dry-run", "-n", action="store_true", help="실제 변경 없이 미리보기")
    parser.add_argument("--rollback", action="store_true", help="이전 구조로 롤백")
    parser.add_argument("--no-backup", action="store_true", help="백업 건너뜀")
    args = parser.parse_args()

    if args.rollback:
        rollback(ROOT)
        return

    print("\n📁 Folder Structure Improvement Agent")
    print("=" * 50)
    if args.dry_run:
        print("  ⚠ DRY-RUN 모드: 실제 변경 없음")
    print()

    all_results = []

    # 1. 백업
    if not args.dry_run and not args.no_backup:
        print("[0/5] 백업 생성 중...")
        snapshot = create_backup(ROOT)
        print(f"      → {len(snapshot['files'])}개 파일 스냅샷 저장")

    # 2. 디렉토리 생성
    print("[1/5] 디렉토리 생성 중...")
    dir_results = create_directories(ROOT, STRUCTURE_PLAN["create_dirs"], args.dry_run)
    created = sum(1 for r in dir_results if r["status"] == "created")
    existed = sum(1 for r in dir_results if r["status"] == "exists")
    all_results.extend(dir_results)
    print(f"      → 생성: {created}개 / 기존: {existed}개")

    # 3. 파일 이동
    print("[2/5] 파일 이동 중...")
    move_results = move_files(ROOT, STRUCTURE_PLAN["move_files"], args.dry_run)
    moved = sum(1 for r in move_results if r["status"] == "moved")
    all_results.extend(move_results)
    print(f"      → 이동: {moved}개")

    # 4. 이미지 동기화
    print("[3/5] 이미지 assets/ 동기화 중...")
    img_results = sync_images(ROOT, args.dry_run)
    synced = sum(1 for r in img_results if r["status"] == "copied")
    all_results.extend(img_results)
    print(f"      → 동기화: {synced}개")

    # 5. HTML 경로 업데이트
    print("[4/5] HTML 경로 업데이트 중...")
    path_results = update_html_paths(ROOT, STRUCTURE_PLAN["path_updates"], args.dry_run)
    updated = sum(1 for r in path_results if r["status"] == "updated")
    all_results.extend(path_results)
    print(f"      → 업데이트: {updated}개 파일")

    # 6. 리포트 저장
    print("[5/5] 리포트 생성 중...")
    report_path = save_report(all_results, ROOT, args.dry_run)
    print(f"      → 저장: {report_path.relative_to(ROOT)}")

    # 현재 구조 출력
    print(f"\n{'=' * 50}")
    print("📂 현재 폴더 구조:")
    print()
    print(build_tree(ROOT))
    print()
    print(f"✅ 완료 ({'미적용' if args.dry_run else '적용됨'})")
    if not args.dry_run and not args.no_backup:
        print(f"   롤백: python3 agents/03_improve_structure.py --rollback")
    print()


if __name__ == "__main__":
    main()
