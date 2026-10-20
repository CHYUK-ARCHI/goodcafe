/**
 * 분해 액소노메트릭(exploded axonometric) 평면 레이어.
 * n×n 그리드 판을 등각 투영으로 그리고, 판(plate)마다 <g data-plate> 로 묶어
 * GSAP 이 y 이동으로 판 사이를 벌리거나(분해) 닫을(조립) 수 있게 한다.
 */
const CW = 20; // 셀 반폭(px, viewBox 단위)
const CH = 11.55; // 셀 반높이 = CW·tan30°
const T = 5; // 판 두께

type Tone = "ink" | "accent" | "ash";
export type AxoMark = [i: number, j: number, tone?: Tone];

type AxoProps = {
  n?: number;
  plates?: number;
  gap?: number;
  labels?: string[];
  marks?: AxoMark[][];
  className?: string;
};

const p = (i: number, j: number) => [(i - j) * CW, (i + j) * CH] as const;
const pts = (...xy: (readonly [number, number])[]) => xy.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
const FILL: Record<Tone, string> = { ink: "#171717", accent: "#2f7fe6", ash: "#c9c9c9" };

export function Axo({ n = 6, plates = 1, gap = 70, labels = [], marks = [], className = "" }: AxoProps) {
  const pad = 24;
  const w = 2 * n * CW + pad * 2 + 90; // 오른쪽 라벨 여백
  const h = 2 * n * CH + T + (plates - 1) * gap + pad * 2;
  const ox = n * CW + pad;
  const oy = pad + (plates - 1) * gap;

  return (
    <svg className={`axo ${className}`} viewBox={`0 0 ${w.toFixed(0)} ${h.toFixed(0)}`} aria-hidden="true">
      <g transform={`translate(${ox} ${oy})`}>
        {Array.from({ length: plates }, (_, k) => (
          <g key={k} className="axo__plate" data-plate={k} transform={`translate(0 ${-k * gap})`}>
            {/* 두께(측면) */}
            <polygon className="axo__side" points={pts(p(0, n), p(n, n), [p(n, n)[0], p(n, n)[1] + T], [p(0, n)[0], p(0, n)[1] + T])} />
            <polygon className="axo__side" points={pts(p(n, 0), p(n, n), [p(n, n)[0], p(n, n)[1] + T], [p(n, 0)[0], p(n, 0)[1] + T])} />
            {/* 상판 */}
            <polygon className="axo__top" points={pts(p(0, 0), p(n, 0), p(n, n), p(0, n))} />
            {Array.from({ length: n * n }, (_, c) => {
              const i = c % n;
              const j = Math.floor(c / n);
              return <polygon key={c} className="axo__cell" data-cell={`${i}-${j}`} points={pts(p(i, j), p(i + 1, j), p(i + 1, j + 1), p(i, j + 1))} />;
            })}
            {(marks[k] || []).map(([i, j, tone = "ink"], m) => (
              <polygon key={`m${m}`} className="axo__mark" fill={FILL[tone]} points={pts(p(i, j), p(i + 1, j), p(i + 1, j + 1), p(i, j + 1))} />
            ))}
            <polygon className="axo__edge" points={pts(p(0, 0), p(n, 0), p(n, n), p(0, n))} />
            {labels[k] && (
              <g className="axo__label">
                <line x1={p(n, 0)[0] + 6} y1={p(n, 0)[1]} x2={p(n, 0)[0] + 30} y2={p(n, 0)[1]} />
                <text x={p(n, 0)[0] + 36} y={p(n, 0)[1] + 4}>{labels[k]}</text>
              </g>
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}
