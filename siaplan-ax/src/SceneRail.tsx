import { useEffect, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToY } from "./lib/smooth";
import { snapPoints } from "./lib/stepper";

gsap.registerPlugin(ScrollTrigger);

const GAP = 14; // 바 사이 간격(px)
const REACH = 70; // 확대가 미치는 거리(px)

type Scene = { label: string; el: HTMLElement };

/** 장면으로 이동할 지점: 그 장면의 첫 멈춤 지점(없으면 장면 시작) */
function targetFor(el: HTMLElement) {
  const top = el.offsetTop;
  const bottom = top + el.offsetHeight;
  const inside = snapPoints().filter((p) => p >= top - 2 && p < bottom - 2);
  return inside.length ? Math.min(...inside) : top;
}

/**
 * 왼쪽 장면 바. 장면마다 짧은 가로 바 하나.
 * - 마우스: 가까이 대면 커서 주변 바가 독(dock)처럼 길어지고 이름이 보인다. 클릭하면 이동.
 * - 터치: 누르면 목록이 펼쳐지고, 위아래로 끌면 확대된 바와 이름이 따라오며, 손을 떼면 그 장면으로 이동.
 */
export function SceneRail() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [active, setActive] = useState(0);
  const [probe, setProbe] = useState<number | null>(null);
  const [touching, setTouching] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("section[data-label]"));
    setScenes(els.map((el) => ({ label: el.dataset.label || "", el })));
    const triggers = els.map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setActive(i)
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const yOf = (e: RPointerEvent) => e.clientY - (listRef.current?.getBoundingClientRect().top ?? 0);
  const nearest = (y: number) => Math.max(0, Math.min(scenes.length - 1, Math.round((y - GAP / 2) / GAP)));
  const go = (i: number) => scenes[i] && scrollToY(targetFor(scenes[i].el));

  const onPointerDown = (e: RPointerEvent<HTMLOListElement>) => {
    if (e.pointerType === "mouse") return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* 합성 이벤트 등 캡처할 수 없는 포인터는 무시 */
    }
    setTouching(true);
    setProbe(yOf(e));
  };
  const onPointerMove = (e: RPointerEvent<HTMLOListElement>) => {
    if (e.pointerType === "mouse" || touching) setProbe(yOf(e));
  };
  const onPointerUp = (e: RPointerEvent<HTMLOListElement>) => {
    if (e.pointerType === "mouse" || !touching) return;
    go(nearest(yOf(e)));
    setTouching(false);
    setProbe(null);
  };
  const onPointerLeave = (e: RPointerEvent<HTMLOListElement>) => {
    if (e.pointerType === "mouse") setProbe(null);
  };

  const focus = probe === null ? -1 : nearest(probe);

  return (
    <nav className={`rail${probe !== null ? " rail--probe" : ""}${touching ? " rail--touch" : ""}`} aria-label="장면 바로가기">
      <ol
        ref={listRef}
        className="rail__list"
        style={{ height: scenes.length * GAP }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          setTouching(false);
          setProbe(null);
        }}
        onPointerLeave={onPointerLeave}
      >
        {scenes.map((s, i) => {
          const center = i * GAP + GAP / 2;
          const f = probe === null ? 0 : Math.max(0, 1 - Math.abs(center - probe) / REACH);
          const width = 12 + f * 30 + (i === active ? 8 : 0);
          const state = i === active ? "is-active" : i < active ? "is-past" : "";
          return (
            <li key={s.label} className={`rail__item ${state}${i === focus ? " is-focus" : ""}`} style={{ top: i * GAP }}>
              <button
                type="button"
                className="rail__hit"
                aria-label={`${String(i).padStart(2, "0")} ${s.label}`}
                aria-current={i === active ? "step" : undefined}
                onClick={() => go(i)}
              >
                <span className="rail__bar" style={{ width }} />
                {/* 이름은 가장 가까운 바 하나만 보여 준다 (겹침 방지) */}
                <span className="rail__label" style={{ opacity: i === focus ? 1 : 0, left: width + 12 }}>
                  <span className="rail__num">{String(i).padStart(2, "0")}</span> {s.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
