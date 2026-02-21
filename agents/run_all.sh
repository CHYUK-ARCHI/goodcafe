#!/usr/bin/env bash
# ============================================================
# run_all.sh — Re-Archive 에이전트 전체 파이프라인
# ============================================================
# 사용법:
#   ./agents/run_all.sh            # 전체 파이프라인 실행
#   ./agents/run_all.sh --dry-run  # 미리보기 모드
#   ./agents/run_all.sh --push     # 완료 후 git push
# ============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
DRY_RUN=""
PUSH=""

for arg in "$@"; do
  case "$arg" in
    --dry-run|-n) DRY_RUN="--dry-run" ;;
    --push)       PUSH="--push" ;;
  esac
done

cd "$ROOT_DIR"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║       Re-Archive Agent Pipeline                      ║"
echo "╚══════════════════════════════════════════════════════╝"
[ -n "$DRY_RUN" ] && echo "  ⚠ DRY-RUN 모드 활성화"
echo ""

run_agent() {
  local num="$1"
  local script="$2"
  local label="$3"
  shift 3
  echo "──────────────────────────────────────────────────────"
  echo "  [$num/5] $label"
  echo "──────────────────────────────────────────────────────"
  python3 "agents/$script" "$@" $DRY_RUN
  echo ""
}

run_agent "1" "01_analyze.py"          "레포지토리 분석"
run_agent "2" "02_find_skills.py"      "스킬 발굴 & 생성"
run_agent "3" "03_improve_structure.py" "폴더 구조 개선"
run_agent "4" "04_check.py"            "품질 검증"
run_agent "5" "05_publish.py"          "문서화 & 배포 준비" ${PUSH:+--push}

echo "╔══════════════════════════════════════════════════════╗"
echo "║  ✅ 파이프라인 완료                                    ║"
echo "║                                                      ║"
echo "║  리포트 확인:                                          ║"
echo "║    reports/analysis.md   — 분석 리포트               ║"
echo "║    reports/skills.md     — 스킬 리포트               ║"
echo "║    reports/structure.md  — 구조 리포트               ║"
echo "║    reports/check.md      — 검증 리포트               ║"
echo "║    reports/summary.md    — 통합 요약                 ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
