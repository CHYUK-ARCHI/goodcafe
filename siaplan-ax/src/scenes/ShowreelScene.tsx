import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION, steps, useScrollScene } from "../lib/motion";

const BASE = import.meta.env.BASE_URL;
const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

/**
 * 쇼릴. 스텝 스크롤로 이 장면에 도착하면 영상이 자동 재생되고, 벗어나면 멈춘다.
 * 영상은 HyperFrames 로 렌더링한 27초 티저.
 */
export function ShowreelScene() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  // 창이 커지며 들어오고, 다 커진 시점에 한 번 멈춘다
  useScrollScene(ref, (tl, el) => {
    tl.fromTo(el.querySelector("[data-frame]"), { scale: 0.86 }, { scale: 1, duration: 1, ease: "power2.out" }, 0)
      .to({}, { duration: 1 }, 1);
    steps(tl, [1]);
  });

  useEffect(() => {
    const scene = ref.current;
    const video = videoRef.current;
    if (!scene || !video) return;

    // 재생 위치를 창 상단 시간과 하단 진행선에 표시
    let raf = 0;
    const paint = () => {
      const d = video.duration || 27;
      if (timeRef.current) timeRef.current.textContent = `${fmt(video.currentTime)} / ${fmt(d)}`;
      if (barRef.current) barRef.current.style.transform = `scaleX(${video.currentTime / d})`;
      if (!video.paused) raf = requestAnimationFrame(paint);
    };
    const onPlay = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("seeked", paint);

    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const st = ScrollTrigger.create({
        trigger: scene,
        start: "top 40%",
        end: "bottom 60%",
        onToggle: (self) => {
          if (self.isActive) video.play().catch(() => {});
          else video.pause();
        }
      });
      return () => st.kill();
    });
    // 모바일·reduced-motion: 사용자가 직접 재생
    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      video.controls = true;
      return () => {
        video.controls = false;
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("seeked", paint);
      mm.revert();
    };
  }, []);

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 2 }} data-haze="0.36" data-tone="0.6" data-label="Showreel">
      <div className="stage stage--center reel">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_06 Showreel</p>
        <figure className="card reel__win" data-frame data-reveal>
          <figcaption className="reel__bar">
            <span className="eyebrow">siaplan-ax-teaser.mp4</span>
            <span className="eyebrow eyebrow--muted" ref={timeRef}>00:00 / 00:27</span>
          </figcaption>
          <div className="reel__screen">
            <video ref={videoRef} className="reel__video" poster={`${BASE}video/poster.jpg`} muted loop playsInline preload="auto" aria-label="SIAPLAN AI/AX 모션그래픽 티저 (27초)">
              <source src={`${BASE}video/siaplan-ax-teaser.webm`} type="video/webm" />
              <source src={`${BASE}video/siaplan-ax-teaser.mp4`} type="video/mp4" />
            </video>
          </div>
          <span className="reel__scrub" ref={barRef} aria-hidden="true" />
        </figure>
        <p className="caption reel__cap" data-reveal>
          <span className="eyebrow">Showreel · 27s</span>&nbsp;&nbsp;Rendered with HyperFrames
        </p>
      </div>
    </section>
  );
}
