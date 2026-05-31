import "./index.css";
import React from "react";
import { Composition } from "remotion";
import { MyComposition } from "./Composition";
import { MyReelReel } from "./MyReelReel";
import { BrandingReelReel } from "./BrandingReelReel";
import { GraphifyBrandReel } from "./GraphifyBrandReel";
import { GstackBrandReel } from "./GstackBrandReel";
import { PaperclipBrandReel } from "./PaperclipBrandReel";
import { BrandingReelLandscape } from "./BrandingReelLandscape";

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

        <Composition
          id="GraphifyBrandReel"
          component={GraphifyBrandReel}
          durationInFrames={1956}
          fps={30}
          width={1080}
          height={1920}
        />

        <Composition
          id="GstackBrandReel"
          component={GstackBrandReel}
          durationInFrames={2820}
          fps={30}
          width={1080}
          height={1920}
        />

        <Composition
          id="PaperclipBrandReel"
          component={PaperclipBrandReel}
          durationInFrames={1650}
          fps={30}
          width={1080}
          height={1920}
        />

        <Composition
          id="BrandingReelLandscape"
          component={BrandingReelLandscape}
          durationInFrames={1625}
          fps={30}
          width={1920}
          height={1080}
        />
</>
  );
};
