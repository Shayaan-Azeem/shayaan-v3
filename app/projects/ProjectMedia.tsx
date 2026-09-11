import Image from "next/image";
import AsciiImage from "../components/AsciiImage";
import AsciiVideo from "../components/AsciiVideo";
import HalftoneVideo from "../components/HalftoneVideo";
import styles from "../page.module.css";
import type { Project } from "./data";

export default function ProjectMedia({
  project,
  sizes,
}: {
  project: Project;
  sizes: string;
}) {
  const poster = project.hideVideoPoster ? undefined : project.images[0];

  return (
    <span
      className={`${styles.homeProjectImage} ${
        project.overlayLogo ? styles.homeProjectImageBranded : ""
      } ${project.shortMedia ? styles.homeProjectImageShort : ""}`}
    >
      {project.imageEffect === "ascii" ? (
        <AsciiImage
          src={project.images[0]}
          alt={`${project.title} project preview rendered as ASCII art`}
          className={styles.homeProjectAscii}
        />
      ) : project.videoEffect === "ascii" && project.video ? (
        <AsciiVideo
          src={project.video}
          poster={poster}
          className={styles.homeProjectAscii}
        />
      ) : project.videoEffect === "halftone" && project.video ? (
        <HalftoneVideo
          src={project.video}
          poster={poster}
          alt={`${project.title} montage rendered as a field of dots`}
          className={styles.homeProjectHalftone}
        />
      ) : project.video ? (
        <video
          src={project.video}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      ) : (
        <Image
          src={project.images[0]}
          alt={`${project.title} project preview`}
          fill
          sizes={sizes}
        />
      )}
      {project.overlayLogo ? (
        <span className={styles.homeProjectLogo}>
          <Image src={project.overlayLogo} alt="" width={499} height={136} />
        </span>
      ) : null}
      {project.overlayText ? (
        <span className={styles.homeProjectWordmark}>{project.overlayText}</span>
      ) : null}
    </span>
  );
}
