import type { ReactNode } from "react";

type PinProps = {
  x: number;
  y: number;
  children: ReactNode;
  /** 안쪽 노드(칩) 클래스 */
  className?: string;
  /** 바깥 0×0 핀 클래스 */
  pinClass?: string;
  [key: `data-${string}`]: string | boolean | undefined;
};

/**
 * 스테이지(%) 좌표의 한 점에 노드를 놓는다.
 * 0×0 박스를 left/top에 두고 안쪽 노드를 flex로 중앙 정렬하므로,
 * GSAP이 x/y/scale 을 건드려도 중앙 정렬과 충돌하지 않는다.
 */
export function Pin({ x, y, children, className = "", pinClass = "", ...rest }: PinProps) {
  return (
    <span className={`pin ${pinClass}`} style={{ ["--x" as string]: `${x}%`, ["--y" as string]: `${y}%` }} {...rest}>
      <span className={className}>{children}</span>
    </span>
  );
}
