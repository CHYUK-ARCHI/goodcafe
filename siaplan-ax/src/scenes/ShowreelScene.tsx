import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DESKTOP_MOTION, MOBILE_MOTION } from "../lib/motion";

const BASE = import.meta.env.BASE_URL;
const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;

/** 스크롤 위치로 영상 프레임을 직접 넘기는(video scrubbing) 쇼릴. 영상은 HyperFrames 로 렌더링. */
export function ShowreelScene() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const scene = ref.current;
    const video = videoRef.current;
    if (!scene || !video) return;
    const mm = gsap.matchMedia();

    mm.add(DESKTOP_MOTION, () => {
      let target = 0;
      let raf = 0;
      const seek = () => {
        raf = 0;
        if (!video.duration || Number.isNaN(video.duration)) return;
        // 한 프레임 이상 차이날 때만 seek (불필요한 디코딩 방지)
        if (Math.abs(video.currentTime - target) > 1 / 60) video.currentTime = target;
        if (timeRef.current) timeRef.current.textContent = `${fmt(target)} / ${fmt(video.duration)}`;
      };
      video.pause();
      const st = ScrollTrigger.create({
        trigger: scene,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = Math.min(1, Math.max(0, (self.progress - 0.1) / 0.8));
          target = p * (video.duration || 0);
          if (!raf) raf = requestAnimationFrame(seek);
        }
      });
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: scene, start: "top top", end: "bottom bottom", scrub: 0.6 }
      });
      tl.fromTo(scene.querySelector("[data-frame]"), { scale: 0.86 }, { scale: 1, duration: 1, ease: "power2.out" }, 0)
        .fromTo(scene.querySelector("[data-scrub]"), { scaleX: 0 }, { scaleX: 1, duration: 8 }, 1)
        .to({}, { duration: 1 }, 9);
      return () => {
        if (raf) cancelAnimationFrame(raf);
        st.kill();
      };
    });

    // 모바일·reduced-motion: 일반 컨트롤로 재생
    mm.add("(max-width: 899px), (prefers-reduced-motion: reduce)", () => {
      video.controls = true;
      return () => {
        video.controls = false;
      };
    });
    mm.add(MOBILE_MOTION, () => {
      gsap.from(scene.querySelectorAll("[data-reveal]"), {
        y: 32, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: scene, start: "top 75%", once: true }
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="scene" style={{ ["--len" as string]: 5 }} data-haze="0.45" data-label="Showreel">
      <div className="stage stage--center reel">
        <p className="eyebrow eyebrow--muted stage__eyebrow" data-reveal>_05 Showreel</p>
        <figure className="card reel__win" data-frame data-reveal>
          <figcaption className="reel__bar">
            <span className="eyebrow">siaplan-ax-teaser.mp4</span>
            <span className="eyebrow eyebrow--muted" ref={timeRef}>00:00 / 00:27</span>
          </figcaption>
          <div className="reel__screen">
            <video ref={videoRef} className="reel__video" poster={`${BASE}video/poster.jpg`} muted playsInline preload="auto" aria-label="SIAPLAN AI/AX 모션그래픽 티저 (27초)">
              <source src={`${BASE}video/siaplan-ax-teaser.webm`} type="video/webm" />
              <source src={`${BASE}video/siaplan-ax-teaser.mp4`} type="video/mp4" />
            </video>
          </div>
          <span className="reel__scrub" data-scrub aria-hidden="true" />
        </figure>
        <p className="caption reel__cap" data-reveal>
          <span className="eyebrow">Scroll to scrub</span>&nbsp;&nbsp;스크롤하면 영상이 재생됩니다 · Rendered with HyperFrames
        </p>
      </div>
    </section>
  );
}
