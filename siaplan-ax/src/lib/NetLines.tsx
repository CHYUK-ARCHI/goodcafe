import { useLayoutEffect, useRef } from "react";

export type NetLine = { x1: number; y1: number; x2: number; y2: number; hair?: boolean };

/**
 * 스테이지(%) 좌표의 선분들을 SVG로 그린다.
 * viewBox 스케일링을 쓰면 가로·세로 선 굵기가 달라지므로, 실제 px 크기를 재서 좌표를 계산한다.
 * pathLength=1 + dasharray=1 이라 strokeDashoffset 1→0 으로 "선 그리기" 모션을 줄 수 있다.
 */
export function NetLines({ lines, className = "", dataAttr }: { lines: NetLine[]; className?: string; dataAttr?: string }) {
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const place = () => {
      const { width, height } = svg.getBoundingClientRect();
      svg.querySelectorAll("line").forEach((el, i) => {
        const l = lines[i];
        el.setAttribute("x1", String((l.x1 / 100) * width));
        el.setAttribute("y1", String((l.y1 / 100) * height));
        el.setAttribute("x2", String((l.x2 / 100) * width));
        el.setAttribute("y2", String((l.y2 / 100) * height));
      });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [lines]);

  const extra = dataAttr ? { [dataAttr]: "" } : {};
  return (
    <svg ref={ref} className={`net__svg ${className}`} aria-hidden="true">
      {lines.map((l, i) => (
        <line key={i} className={l.hair ? "hair" : undefined} pathLength={1} strokeDasharray={1} {...extra} />
      ))}
    </svg>
  );
}
