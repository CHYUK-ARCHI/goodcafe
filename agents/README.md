# Re-Archive Agent System

> Re-Archive 레포지토리 자동화 에이전트 모음

---

## 에이전트 목록

| # | 에이전트 | 역할 | 출력 |
|---|---------|------|------|
| 1 | `01_analyze.py` | 레포지토리 전체 분석 | `reports/analysis.md` |
| 2 | `02_find_skills.py` | 누락 스킬 탐지 & 생성 | `js/*.js`, `css/*.css`, `reports/skills.md` |
| 3 | `03_improve_structure.py` | 폴더 구조 최적화 | 파일 재배치, `reports/structure.md` |
| 4 | `04_check.py` | HTML/JS/CSS 품질 검증 | `reports/check.md` |
| 5 | `05_publish.py` | README/문서화/배포 준비 | `README.md`, `CHANGELOG.md`, `docs/`, `reports/summary.md` |

---

## 빠른 시작

```bash
# 전체 파이프라인 실행
bash agents/run_all.sh

# 미리보기 (파일 변경 없음)
bash agents/run_all.sh --dry-run

# 완료 후 git push
bash agents/run_all.sh --push
```

## 개별 실행

```bash
python3 agents/01_analyze.py           # 분석만
python3 agents/02_find_skills.py       # 스킬 생성만
python3 agents/03_improve_structure.py # 구조 개선만
python3 agents/04_check.py             # 검증만
python3 agents/05_publish.py           # 문서화만
```

## 요구사항

- Python 3.9+
- 추가 패키지 불필요 (표준 라이브러리만 사용)
