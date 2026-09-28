"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./flow-diagram.module.css";

export default function FlowDiagram({ name, title }: {
  name: "prompt-to-game" | "jev-reuse-flow";
  title: string;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState<number>();

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || event.data?.type !== "murphe-diagram-height") return;
      const value = event.data.height;
      if (typeof value === "number" && Number.isFinite(value) && value > 0 && value < 5000) setHeight(value);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, []);

  return <iframe ref={frame} className={styles.diagram} data-diagram={name}
    src={`/murph-e/diagrams/${name}.html`} title={title}
    loading="lazy" sandbox="allow-scripts" style={{ height }} />;
}
