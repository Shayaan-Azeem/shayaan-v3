import Layout from "../components/Layout";
import styles from "../page.module.css";
import ProjectsGallery from "./ProjectsGallery";

export default function Projects() {
  return (
    <Layout active="/projects" wide className={styles.projectsPageShell}>
      <section
        className={`${styles.homeProjects} ${styles.projectsPage}`}
        aria-label="Projects"
      >
        <ProjectsGallery />
      </section>
    </Layout>
  );
}
