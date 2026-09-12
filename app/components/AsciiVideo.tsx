"use client";

import SampledVideoCanvas from "./SampledVideoCanvas";
import { paintAsciiFrame } from "./pixelCanvas";

export default function AsciiVideo({
  src,
  paused,
  onPlaybackChange,
  className,
  alt = "Video rendered as animated ASCII art",
}: {
  src: string;
  paused: boolean;
  onPlaybackChange?: (playing: boolean) => void;
  className?: string;
  alt?: string;
}) {
  return (
    <SampledVideoCanvas
      src={src}
      paused={paused}
      onPlaybackChange={onPlaybackChange}
      className={className}
      alt={alt}
      columns={120}
      rows={90}
      frameInterval={42}
      paint={paintAsciiFrame}
    />
  );
}
