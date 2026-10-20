import type { ReactNode } from "react";

/** 줄 단위 마스크. 안쪽 span(.mask__in)을 yPercent로 올려 글자가 선 밑에서 솟아오르게 한다. */
export function Mask({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`mask ${className}`}>
      <span className="mask__in">{children}</span>
    </span>
  );
}
