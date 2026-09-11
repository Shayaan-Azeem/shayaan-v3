import AnnotationHighlight from "../components/AnnotationHighlight";
import styles from "../page.module.css";
import type { Project } from "./data";
import ProjectMedia from "./ProjectMedia";

/**
 * `featured` cards label every project and can highlight awards; `gallery`
 * cards (projects page) show the description and only an explicit period.
 */
export default function ProjectCard({
  project,
  mediaSizes,
  variant,
  eager = false,
  showAward = true,
}: {
  project: Project;
  mediaSizes: string;
  variant: "featured" | "gallery";
  eager?: boolean;
  showAward?: boolean;
}) {
  const featured = variant === "featured";

  return (
    <article
      className={`${styles.homeProjectCard} ${styles.projectsPageCard}`}
    >
      <ProjectMedia project={project} sizes={mediaSizes} eager={eager} />
      <a
        className={styles.projectCardTextLink}
        href={project.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2 className={styles.homeProjectTitle}>
          {project.title}
          {featured && showAward && project.award ? (
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
        </h2>
        {!featured && typeof project.desc === "string" ? (
          <span className={styles.homeProjectDesc}>{project.desc}</span>
        ) : null}
      </a>
      {!featured && Array.isArray(project.desc) ? (
        <p className={styles.homeProjectDesc}>
          {project.desc.map((part, index) => typeof part === "string" ? part : (
            <a key={index} className={styles.projectDescriptionLink} href={part.href} target="_blank" rel="noopener noreferrer">
              {part.label}
            </a>
          ))}
        </p>
      ) : null}
    </article>
  );
}
