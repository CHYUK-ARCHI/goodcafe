import { Fragment, useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chrome } from "./Chrome";
import { SceneRail } from "./SceneRail";
import { Haze } from "./lib/Haze";
import { initSmoothScroll } from "./lib/smooth";
import { CHAPTERS } from "./lib/chapters";
import { HeroScene } from "./scenes/HeroScene";
import { ChapterScene } from "./scenes/ChapterScene";
import { SharingScene } from "./scenes/SharingScene";
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
        {CHAPTERS.map((ch) => (
          <Fragment key={ch.id}>
            <ChapterScene ch={ch} />
            {/* 공유 분야 다음: 각자 만든 프로그램이 모두의 도구가 되는 그림 */}
            {ch.id === "share" && <SharingScene />}
          </Fragment>
        ))}
        <FinalScene />
        <ApplyScene />
      </main>
    </>
  );
}
