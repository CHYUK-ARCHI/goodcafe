import { Fragment } from "react";

/** "==강조==" 는 굵은 글씨(<b class="em">), "\n" 은 줄바꿈으로 바꾼다. */
export function Hl({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && <br />}
          {line.split(/==(.+?)==/g).map((part, i) =>
            i % 2 ? <b key={i} className="em">{part}</b> : <Fragment key={i}>{part}</Fragment>
          )}
        </Fragment>
      ))}
    </>
  );
}
