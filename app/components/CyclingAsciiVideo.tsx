"use client";

import { useState } from "react";
import AsciiVideo from "./AsciiVideo";

type Clip = {
  src: string;
  poster: string;
  alt: string;
};

export default function CyclingAsciiVideo({
  clips,
  className,
  columns,
  rows,
}: {
  clips: Clip[];
  className?: string;
  columns?: number;
  rows?: number;
}) {
  const [activeClip, setActiveClip] = useState(0);
  const clip = clips[activeClip];

  return (
    <AsciiVideo
      key={clip.src}
      src={clip.src}
      poster={clip.poster}
      alt={clip.alt}
      className={className}
      columns={columns}
      rows={rows}
      loop={false}
      onEnded={() => setActiveClip((current) => (current + 1) % clips.length)}
    />
  );
}
