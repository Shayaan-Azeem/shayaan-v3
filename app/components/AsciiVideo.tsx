"use client";

import SampledVideoCanvas from "./SampledVideoCanvas";
import { paintAsciiFrame } from "./pixelCanvas";

export default function AsciiVideo({
  src,
  poster,
  className,
  alt = "Video rendered as animated ASCII art",
}: {
  src: string;
  poster?: string;
  className?: string;
  alt?: string;
}) {
  return (
    <SampledVideoCanvas
      src={src}
      poster={poster}
      className={className}
      alt={alt}
      columns={120}
      rows={90}
      frameInterval={42}
      paint={paintAsciiFrame}
    />
  );
}
