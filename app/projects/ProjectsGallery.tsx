"use client";

import Image from "next/image";
import { useState } from "react";
import AsciiImage from "../components/AsciiImage";
import AsciiVideo from "../components/AsciiVideo";
import HalftoneVideo from "../components/HalftoneVideo";
import styles from "../page.module.css";
import { PROJECTS, type Project } from "./data";

type ProjectCategory = "projects" | "work" | "communities";

const ALL_CATEGORIES: ProjectCategory[] = [
  "projects",
  "work",
  "communities",
];

const FILTERS: Array<{ label: string; value: ProjectCategory }> = [
  { label: "Projects", value: "projects" },
  { label: "Work", value: "work" },
  { label: "Communities", value: "communities" },
];

function getProjectCategory(project: Project): ProjectCategory {
  if (project.category === "community") return "communities";
  if (project.category === "project") return "projects";
  return "work";
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <a
      className={`${styles.homeProjectCard} ${styles.projectsPageCard}`}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
    >
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
            poster={project.hideVideoPoster ? undefined : project.images[0]}
            className={styles.homeProjectAscii}
          />
        ) : project.videoEffect === "halftone" && project.video ? (
          <HalftoneVideo
            src={project.video}
            poster={project.hideVideoPoster ? undefined : project.images[0]}
            className={styles.homeProjectHalftone}
          />
        ) : project.video ? (
          <video
            src={project.video}
            poster={project.hideVideoPoster ? undefined : project.images[0]}
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
            sizes="(max-width: 767px) calc(100vw - 40px), 288px"
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
        {project.brandLogos ? (
          <span
            className={styles.homeProjectBrands}
            aria-label="OnePrep, RevisionDojo, and MathsGenie"
          >
            {project.brandLogos.map((logo) => (
              <span key={logo.src} className={styles.homeProjectBrand}>
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                />
              </span>
            ))}
          </span>
        ) : null}
        {project.period ? (
          <span className={styles.homeProjectPeriod}>{project.period}</span>
        ) : null}
      </span>
      <span className={styles.homeProjectDesc}>{project.desc}</span>
    </a>
  );
}

export default function ProjectsGallery() {
  const [activeFilters, setActiveFilters] = useState<Set<ProjectCategory>>(
    () => new Set(ALL_CATEGORIES),
  );

  function toggleFilter(filter: ProjectCategory) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  const visibleProjects = PROJECTS.filter((project) => {
    return activeFilters.has(getProjectCategory(project));
  });

  return (
    <>
      <div className={styles.projectFilterBar}>
        <div className={styles.projectFilterTabs} aria-label="Filter projects">
          {FILTERS.map((filter) => {
            const selected = activeFilters.has(filter.value);

            return (
              <button
                key={filter.value}
                className={`${styles.projectFilterButton} ${
                  selected ? styles.projectFilterButtonActive : ""
                }`}
                type="button"
                aria-pressed={selected}
                onClick={() => toggleFilter(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className={`${styles.homeProjectGrid} ${styles.projectsPageGrid}`}>
        {visibleProjects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </>
  );
}
