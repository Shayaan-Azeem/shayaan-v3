import Link from "next/link";
import Layout from "./components/Layout";
import styles from "./page.module.css";

export default function Home() {
  return (
    <Layout>
      <p className={styles.paragraph}>
        I am currently building with technology and AI in Toronto. Previously, I
        worked on software and community projects across startups and student
        organizations.
      </p>
      <p className={styles.paragraph}>
        I spend time{" "}
        <Link href="/projects" className={styles.link}>
          building
        </Link>{" "}
        side projects and{" "}
        <Link href="/investments" className={styles.link}>
          investing
        </Link>{" "}
        in startups. I&apos;m passionate about building for a better tomorrow.
      </p>
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com. I&apos;m also
        active on{" "}
        <a
          href="https://x.com/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          X
        </a>
        .
      </p>
    </Layout>
  );
}
