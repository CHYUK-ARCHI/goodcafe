import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { registerSnaps } from "./stepper";

gsap.registerPlugin(ScrollTrigger);

// 데스크톱 + 모션 허용: pin(sticky)·scrub 타임라인 전체 사용
export const DESKTOP_MOTION = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
// 모바일 + 모션 허용: 단순화된 reveal만 사용
export const MOBILE_MOTION = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";

export type SceneBuilder = (tl: gsap.core.Timeline, scene: HTMLElement) => void | (() => void);

/**
 * 한 장면 = 하나의 scrub 타임라인.
 * 스크롤 위치(0–100%)와 타임라인 진행도가 1:1로 대응한다.
 * 장면 DOM의 기본 상태는 "완성된 모습"이며, 초기 상태(숨김·분해)는 빌더 안에서만 설정한다.
 * 그래서 모바일·reduced-motion에서는 빌더가 실행되지 않고 정적 레이아웃이 그대로 보인다.
 */
export function useScrollScene(ref: RefObject<HTMLElement>, build: SceneBuilder) {
  useLayoutEffect(() => {
    const scene = ref.current;
    if (!scene) return;

    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scene,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6
          // invalidateOnRefresh 는 쓰지 않는다: refresh 시 스태거 fromTo 의 시작 상태가 사라진다
        }
      });
      const cleanup = build(tl, scene);
      // 끝까지 한 번 렌더했다가 되돌린다. 스태거가 걸린 fromTo 는 첫 요소만 시작 상태가
      // 즉시 적용되므로, 이렇게 모든 트윈의 시작 값을 기록·적용해 둔다.
      tl.progress(1, true).progress(0, true);
      // step 라벨 = 스텝 스크롤의 멈춤 지점. 라벨이 없으면 장면 시작점에 멈춘다.
      const st = tl.scrollTrigger!;
      const labels = Object.keys(tl.labels).filter((l) => l.startsWith("step"));
      const unregister = registerSnaps(() => (labels.length ? labels.map((l) => st.labelToScroll(l)) : [st.start]));
      return () => {
        unregister();
        if (cleanup) cleanup();
      };
    });

    mm.add(MOBILE_MOTION, () => {
      const items = scene.querySelectorAll<HTMLElement>("[data-reveal]");
      if (!items.length) return;
      gsap.from(items, {
        y: 36,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: { trigger: scene, start: "top 75%", once: true }
      });
    });

    return () => mm.revert();
    // build는 장면 마운트 시 한 번만 실행한다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/** NodeList 대신 배열로 돌려준다 (GSAP 스태거 대상으로 안전). */
export const all = (root: ParentNode, selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));

/** 타임라인 시간들에 step 라벨을 붙인다 (스텝 스크롤이 멈추는 "완성된 구도"). */
export function steps(tl: gsap.core.Timeline, times: number[]) {
  times.forEach((t, i) => tl.addLabel(`step${i}`, t));
}
