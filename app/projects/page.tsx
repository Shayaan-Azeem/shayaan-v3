import Layout from "../components/Layout";
import styles from "../page.module.css";

const PROJECTS = [
  { name: "Project one", href: "https://example.com", blurb: "A short description." },
];

export default function Projects() {
  return (
    <Layout active="/projects">
      <section className={styles.list}>
        {PROJECTS.map((project) => (
          <div key={project.name} className={styles.item}>
            <a
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.itemTitle}
            >
              {project.name}
            </a>
            <p className={styles.small}>{project.blurb}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
