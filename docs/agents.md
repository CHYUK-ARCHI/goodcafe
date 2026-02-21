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
