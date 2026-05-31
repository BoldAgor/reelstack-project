import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { MyReelReel } from "./MyReelReel";
import { BrandingReelReel } from "./BrandingReelReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
    
        <Composition
          id="MyReelReel"
          component={MyReelReel}
          durationInFrames={3156}
          fps={30}
          width={1080}
          height={1920}
        />

        <Composition
          id="BrandingReelReel"
          component={BrandingReelReel}
          durationInFrames={1625}
          fps={30}
          width={1080}
          height={1920}
        />
</>
  );
};
