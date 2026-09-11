"use client";

import { useState, type ReactNode } from "react";
import styles from "../page.module.css";

type ProjectCategory = "project" | "work" | "community";

const FILTERS: Array<{ label: string; value: ProjectCategory }> = [
  { label: "Projects", value: "project" },
  { label: "Work", value: "work" },
  { label: "Communities", value: "community" },
];

export default function ProjectsGallery({
  items,
}: {
  items: { title: string; category: ProjectCategory; card: ReactNode }[];
}) {
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

  const visibleProjects = items.filter((project) =>
    activeFilters.has(project.category),
  );

  return (
    <>
      <div className={styles.projectFilterBar}>
        <div
          className={styles.projectFilterTabs}
          role="group"
          aria-label="Filter projects"
        >
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
                aria-controls="project-results"
                onClick={() => toggleFilter(filter.value)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>
      <p className="sr-only" role="status">
        {visibleProjects.length} of {items.length} projects shown.
      </p>
      <div
        id="project-results"
        className={`${styles.homeProjectGrid} ${styles.projectsPageGrid}`}
      >
        {visibleProjects.map((project) => (
          <div key={project.title}>{project.card}</div>
        ))}
      </div>
      {visibleProjects.length === 0 ? (
        <div className={styles.projectEmpty}>
          <p>Select a category to explore my work.</p>
          <button
            className={`${styles.projectFilterButton} ${styles.projectFilterButtonActive}`}
            type="button"
            onClick={() => setActiveFilters(new Set(FILTERS.map((filter) => filter.value)))}
          >
            Show all projects
          </button>
        </div>
      ) : null}
    </>
  );
}
