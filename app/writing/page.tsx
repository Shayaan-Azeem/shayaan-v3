import Layout from "../components/Layout";
import styles from "../page.module.css";

const POSTS = [
  { title: "Hello world", slug: "hello-world", date: "2026-01-01" },
];

export default function Writing() {
  return (
    <Layout active="/writing">
      <section className={styles.list}>
        {POSTS.map((post) => (
          <div key={post.slug} className={styles.item}>
            <span className={styles.itemTitle}>{post.title}</span>
            <span className={styles.date}>
              <time dateTime={post.date}>{post.date}</time>
            </span>
          </div>
        ))}
      </section>
    </Layout>
  );
}
