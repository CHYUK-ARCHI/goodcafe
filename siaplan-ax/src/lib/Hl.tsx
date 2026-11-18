import { Fragment } from "react";

/** "==강조==" 는 형광펜(<mark class="hl">), "\n" 은 줄바꿈으로 바꾼다. */
export function Hl({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/==(.+?)==/g).map((part, i) =>
            i % 2 ? <mark key={i} className="hl">{part}</mark> : <Fragment key={i}>{part}</Fragment>
          )}
        </Fragment>
      ))}
    </>
  );
}
