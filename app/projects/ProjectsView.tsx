import Layout from "../components/Layout";
import styles from "../page.module.css";
import ProjectsGallery from "./ProjectsGallery";
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "./data";

const MEDIA_SIZES = "(max-width: 639px) calc(100vw - 40px), (max-width: 767px) 600px, 288px";

export default function Projects() {
  return (
    <Layout active="/projects" wide className={styles.projectsPageShell}>
      <section
        className={`${styles.homeProjects} ${styles.projectsPage}`}
        aria-label="Projects"
      >
        <ProjectsGallery items={PROJECTS.map((project, index) => ({
          title: project.title,
          category: project.category,
          card: <ProjectCard project={project} mediaSizes={MEDIA_SIZES} variant="gallery" eager={index < 2} />,
        }))} />
      </section>
    </Layout>
  );
}
