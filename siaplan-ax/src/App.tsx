import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chrome } from "./Chrome";
import { SceneRail } from "./SceneRail";
import { Haze } from "./lib/Haze";
import { initSmoothScroll } from "./lib/smooth";
import { CHAPTERS } from "./lib/chapters";
import { HeroScene } from "./scenes/HeroScene";
import { ChapterScene } from "./scenes/ChapterScene";
import { FinalScene } from "./scenes/FinalScene";
import { ApplyScene } from "./scenes/ApplyScene";

export default function App() {
  useEffect(() => {
    const destroy = initSmoothScroll();
    // 폰트가 로드된 뒤 레이아웃이 바뀌므로 한 번 더 측정한다
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      destroy();
    };
  }, []);

  return (
    <>
      <Haze />
      <Chrome />
      <SceneRail />
      <main>
        <HeroScene />
        {CHAPTERS.map((ch) => <ChapterScene key={ch.id} ch={ch} />)}
        <FinalScene />
        <ApplyScene />
      </main>
    </>
  );
}
