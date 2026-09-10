import Image from "next/image";
import type { ReactNode } from "react";
import AnnotationHighlight from "./components/AnnotationHighlight";
import AsciiImage from "./components/AsciiImage";
import AsciiVideo from "./components/AsciiVideo";
import CopyEmail from "./components/CopyEmail";
import HalftoneVideo from "./components/HalftoneVideo";
import Layout from "./components/Layout";
import ReadMore from "./components/ReadMore";
import styles from "./page.module.css";
import { PROJECTS } from "./projects/data";

function Org({
  src,
  href,
  children,
}: {
  src?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className={styles.org}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {src ? (
        <Image
          className={styles.inlineIcon}
          src={src}
          alt=""
          width={20}
          height={20}
        />
      ) : null}
      {children}
    </a>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <Layout className={styles.homepage}>
      <p className={styles.paragraph}>
        I&rsquo;m a Software Engineer and study Math/Philosophy at the{" "}
        <Org href="https://uwaterloo.ca/">University of Waterloo</Org>.
      </p>
      <ReadMore
        summaryClassName={styles.paragraph}
        summary={
          <>
            Most recently, I was a Member of Technical Staff at{" "}
            <Org
              src="/forus.svg"
              href="https://x.com/sahirjaggi/status/2097333810983555399?s=20"
            >
              Forus
            </Org>{" "}
            in New York City, building AI to make medication cheaper, faster,
            and easier.
          </>
        }
      >
        <p className={styles.paragraph}>
          Previously, I&rsquo;ve built products at{" "}
          <Org href="https://www.generallearning.com/">
            General Learning
          </Org>
          ,{" "}
          <A href="https://tensorforest.com">
            autonomous drones to predict forest fires
          </A>
          ,{" "}
          <A href="https://www.oakvillenews.org/success/new-oakville-robotics-club-now-listed-among-best-in-the-world-9958475">
            one of the best robotics teams in Canada
          </A>
          ,{" "}
          <A href="https://www.teenbuilders.club/">
            communities for ambitious teenagers
          </A>
          ,{" "}
          <A href="https://apocalypse.hackclub.com/">
            Canada&rsquo;s largest high school hackathon
          </A>{" "}
          and{" "}
          <A href="https://www.instagram.com/starthackclub/">@starthackclub</A>.
        </p>
      </ReadMore>
      <p className={styles.small}>
        You can find me on <A href="https://x.com/shayaan">X</A> and{" "}
        <A href="https://www.linkedin.com/in/shayaan-azeem">LinkedIn</A>, or
        reach me via <CopyEmail />.
      </p>
      <section className={styles.homeProjects} aria-label="Selected projects">
        <div
          className={`${styles.homeProjectGrid} ${styles.homeFeaturedGrid}`}
        >
          {PROJECTS.filter((project) =>
            ["Forus", "General Learning", "Coach Bob", "TensorForest"].includes(
              project.title,
            ),
          ).map((project) => (
            <a
              key={project.title}
              className={`${styles.homeProjectCard} ${styles.projectsPageCard}`}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title}`}
            >
              <span
                className={`${styles.homeProjectImage} ${
                  project.overlayLogo ? styles.homeProjectImageBranded : ""
                } ${
                  project.shortMedia ? styles.homeProjectImageShort : ""
                }`}
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
                    poster={
                      project.hideVideoPoster ? undefined : project.images[0]
                    }
                    className={styles.homeProjectAscii}
                  />
                ) : project.videoEffect === "halftone" && project.video ? (
                  <HalftoneVideo
                    src={project.video}
                    poster={
                      project.hideVideoPoster ? undefined : project.images[0]
                    }
                    className={styles.homeProjectHalftone}
                  />
                ) : project.video ? (
                  <video
                    src={project.video}
                    poster={
                      project.hideVideoPoster ? undefined : project.images[0]
                    }
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
                    sizes="(max-width: 639px) calc(100vw - 40px), 490px"
                  />
                )}
                {project.overlayLogo ? (
                  <span className={styles.homeProjectLogo}>
                    <Image
                      src={project.overlayLogo}
                      alt=""
                      width={499}
                      height={136}
                    />
                  </span>
                ) : null}
                {project.overlayText ? (
                  <span className={styles.homeProjectWordmark}>
                    {project.overlayText}
                  </span>
                ) : null}
              </span>
              <span className={styles.homeProjectTitle}>
                {project.title}
                {project.title === "Coach Bob" ? (
                  <span
                    className={`${styles.homeProjectPeriod} ${styles.homeProjectAward}`}
                  >
                    <AnnotationHighlight>
                      Hack The North Winner
                    </AnnotationHighlight>
                  </span>
                ) : project.period || project.title === "TensorForest" ? (
                  <span className={styles.homeProjectPeriod}>
                    {project.period ?? "Project"}
                  </span>
                ) : null}
              </span>
            </a>
          ))}
        </div>
      </section>
    </Layout>
  );
}
