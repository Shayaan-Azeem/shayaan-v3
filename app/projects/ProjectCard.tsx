import AnnotationHighlight from "../components/AnnotationHighlight";
import styles from "../page.module.css";
import type { Project } from "./data";
import ProjectMedia from "./ProjectMedia";

export default function ProjectCard({
  project,
  mediaSizes,
  showDescription = false,
}: {
  project: Project;
  mediaSizes: string;
  showDescription?: boolean;
}) {
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
        {project.award ? (
          <span
            className={`${styles.homeProjectPeriod} ${styles.homeProjectAward}`}
          >
            <AnnotationHighlight>{project.award}</AnnotationHighlight>
          </span>
        ) : project.period ? (
          <span className={styles.homeProjectPeriod}>{project.period}</span>
        ) : null}
      </span>
      {showDescription ? (
        <span className={styles.homeProjectDesc}>{project.desc}</span>
      ) : null}
    </a>
  );
}
