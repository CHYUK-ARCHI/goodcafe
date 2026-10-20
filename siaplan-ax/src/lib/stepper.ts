/**
 * 스텝 스크롤: 휠·키보드·스와이프 한 번에 다음(이전) "멈춤 지점"까지 이동하고 멈춘다.
 * 멈춤 지점은 각 장면 타임라인의 step 라벨(useScrollScene 이 등록)에서 온다.
 */
type SnapGetter = () => number[];
const getters = new Set<SnapGetter>();

export function registerSnaps(getter: SnapGetter): () => void {
  getters.add(getter);
  return () => {
    getters.delete(getter);
  };
}

export function snapPoints(): number[] {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pts = [0, max, ...Array.from(getters).flatMap((g) => g())]
    .filter((p) => Number.isFinite(p))
    .map((p) => Math.round(Math.min(max, Math.max(0, p))))
    .sort((a, b) => a - b);
  // 6px 이내로 겹치는 지점은 하나로
  return pts.filter((p, i) => i === 0 || p - pts[i - 1] > 6);
}

export function nextSnap(current: number, dir: 1 | -1): number | undefined {
  // 안전장치: 등록된 멈춤 지점이 없으면(레이아웃 전환 직후 등) 한 화면만 이동한다
  if (getters.size === 0) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(max, Math.max(0, current + dir * window.innerHeight * 0.9));
  }
  const pts = snapPoints();
  return dir > 0 ? pts.find((p) => p > current + 4) : [...pts].reverse().find((p) => p < current - 4);
}
