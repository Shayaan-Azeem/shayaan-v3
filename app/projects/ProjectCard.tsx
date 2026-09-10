import AnnotationHighlight from "../components/AnnotationHighlight";
import styles from "../page.module.css";
import type { Project } from "./data";
import ProjectMedia from "./ProjectMedia";

/**
 * `featured` cards (home) label every project and highlight awards; `gallery`
 * cards (projects page) show the description and only an explicit period.
 */
export default function ProjectCard({
  project,
  mediaSizes,
  variant,
}: {
  project: Project;
  mediaSizes: string;
  variant: "featured" | "gallery";
}) {
  const featured = variant === "featured";

  return (
    <a
      className={`${styles.homeProjectCard} ${styles.projectsPageCard}`}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${project.title}`}
    >
      <ProjectMedia project={project} sizes={mediaSizes} />
      <span className={styles.homeProjectTitle}>
        {project.title}
        {featured && project.award ? (
          <span
            className={`${styles.homeProjectPeriod} ${styles.homeProjectAward}`}
          >
            <AnnotationHighlight>{project.award}</AnnotationHighlight>
          </span>
        ) : project.period || featured ? (
          <span className={styles.homeProjectPeriod}>
            {project.period ?? "Project"}
          </span>
        ) : null}
      </span>
      {featured ? null : (
        <span className={styles.homeProjectDesc}>{project.desc}</span>
      )}
    </a>
  );
}
