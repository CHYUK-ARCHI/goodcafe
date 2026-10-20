import type { Case } from "./cases";

const BASE = import.meta.env.BASE_URL;

/**
 * 회사 이름 마크 — 공식 로고가 아니라 SIAPLAN 이 만든 중립 타이포 마크.
 * 공식 로고 파일을 받으면 cases.ts 의 logo 에 public 기준 경로를 넣으면 그 이미지로 바뀐다.
 */
export function NameMark({ c, size = "md" }: { c: Pick<Case, "name" | "mark" | "logo" | "tier">; size?: "sm" | "md" }) {
  return (
    <span className={`mark mark--${size}${c.tier === "Small" ? " mark--small" : ""}`} title={c.name}>
      {c.logo ? <img src={`${BASE}${c.logo}`} alt={c.name} /> : <span aria-hidden="true">{c.mark}</span>}
    </span>
  );
}
