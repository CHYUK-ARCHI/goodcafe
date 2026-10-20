import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Chrome } from "./Chrome";
import { initSmoothScroll } from "./lib/smooth";
import { HeroScene } from "./scenes/HeroScene";
import { FromAIToAX } from "./scenes/FromAIToAX";
import { BreakTheWork } from "./scenes/BreakTheWork";
import { WorkflowScene } from "./scenes/WorkflowScene";
import { OrchestratorScene } from "./scenes/OrchestratorScene";
import { PlatformScene } from "./scenes/PlatformScene";
import { PhaseToolsScene } from "./scenes/PhaseToolsScene";
import { GoalsScene } from "./scenes/GoalsScene";
import { JoinScene } from "./scenes/JoinScene";
import { ShowreelScene } from "./scenes/ShowreelScene";
import { RoadmapScene } from "./scenes/RoadmapScene";
import { FinalScene } from "./scenes/FinalScene";

export default function App() {
  useEffect(() => {
    const destroy = initSmoothScroll();
    // 폰트·영상 메타데이터가 로드된 뒤 레이아웃이 바뀌므로 한 번 더 측정한다
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => {
      window.removeEventListener("load", refresh);
      destroy();
    };
  }, []);

  return (
    <>
      <Chrome />
      <main>
        <HeroScene />
        <FromAIToAX />
        <BreakTheWork />
        <WorkflowScene />
        <OrchestratorScene />
        <ShowreelScene />
        <PlatformScene />
        <PhaseToolsScene />
        <GoalsScene />
        <RoadmapScene />
        <JoinScene />
        <FinalScene />
      </main>
    </>
  );
}
