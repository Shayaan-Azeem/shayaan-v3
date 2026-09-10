"use client";

import { useState } from "react";
import styles from "../page.module.css";
import ProjectCard from "./ProjectCard";
import { PROJECTS, type Project } from "./data";

type ProjectCategory = "projects" | "work" | "communities";

const FILTERS: Array<{ label: string; value: ProjectCategory }> = [
  { label: "Projects", value: "projects" },
  { label: "Work", value: "work" },
  { label: "Communities", value: "communities" },
];

const MEDIA_SIZES = "(max-width: 767px) calc(100vw - 40px), 288px";

function getProjectCategory(project: Project): ProjectCategory {
  if (project.category === "community") return "communities";
  if (project.category === "project") return "projects";
  return "work";
}

export default function ProjectsGallery() {
  const [activeFilters, setActiveFilters] = useState<Set<ProjectCategory>>(
    () => new Set(FILTERS.map((filter) => filter.value)),
  );

  function toggleFilter(filter: ProjectCategory) {
    setActiveFilters((current) => {
      const next = new Set(current);
      if (next.has(filter)) next.delete(filter);
      else next.add(filter);
      return next;
    });
  }

  const visibleProjects = PROJECTS.filter((project) =>
    activeFilters.has(getProjectCategory(project)),
  );

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
          <ProjectCard
            key={project.title}
            project={project}
            mediaSizes={MEDIA_SIZES}
            variant="gallery"
          />
        ))}
      </div>
    </>
  );
}
