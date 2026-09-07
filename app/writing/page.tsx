import Layout from "../components/Layout";
import styles from "../page.module.css";

const POSTS = [
  {
    title: "2025 wrapped: in pursuit of global minima",
    summary: "year recap, content recommendations, things i liked",
    date: "2025-12-31",
    href: "https://shayaanazeem.substack.com/p/2025-wrapped-in-pursuit-of-global",
  },
  {
    title: "no regrets",
    summary: "everything i'm not made me everything i am",
    date: "2025-05-21",
    href: "https://shayaanazeem.substack.com/p/no-regrets",
  },
  {
    title: "17 lessons from 17",
    summary: "the most important things 2024 taught me",
    date: "2024-12-31",
    href: "https://shayaanazeem.substack.com/p/17-lessons-from-17",
  },
];

export default function Writing() {
  return (
    <Layout active="/writing">
      <section className={styles.list}>
        {POSTS.map((post) => (
          <div key={post.href} className={styles.item}>
            <a
              className={styles.itemTitle}
              href={post.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.title}
            </a>
            <span className={styles.date}>
              <time dateTime={post.date}>{post.date}</time>
            </span>
            <p className={styles.small}>{post.summary}</p>
          </div>
        ))}
      </section>
    </Layout>
  );
}
