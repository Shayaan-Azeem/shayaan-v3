"use client";

import SampledVideoCanvas from "./SampledVideoCanvas";
import { paintHalftoneFrame } from "./pixelCanvas";

export default function HalftoneVideo({
  src,
  poster,
  paused,
  onPlaybackChange,
  className,
  alt = "Video rendered as a field of dots",
}: {
  src: string;
  poster?: string;
  paused: boolean;
  onPlaybackChange?: (playing: boolean) => void;
  className?: string;
  alt?: string;
}) {
  return (
    <SampledVideoCanvas
      src={src}
      poster={poster}
      paused={paused}
      onPlaybackChange={onPlaybackChange}
      className={className}
      alt={alt}
      columns={64}
      rows={48}
      frameInterval={33}
      paint={paintHalftoneFrame}
    />
  );
}
