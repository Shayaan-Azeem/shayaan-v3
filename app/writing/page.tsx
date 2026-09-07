import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../page.module.css";

const POSTS = [
  {
    title: "2025 wrapped: in pursuit of global minima",
    date: "2025-12-31",
    desc: "year recap, content recommendations, things i liked",
    images: [
      "/writing/2025-wrapped-1.jpg",
      "/writing/2025-wrapped-2.jpg",
      "/writing/2025-wrapped-3.jpg",
    ],
    href: "https://shayaanazeem.substack.com/p/2025-wrapped-in-pursuit-of-global",
  },
  {
    title: "no regrets",
    date: "2025-05-21",
    desc: "everything i'm not made me everything i am",
    images: ["/writing/no-regrets.jpg"],
    href: "https://shayaanazeem.substack.com/p/no-regrets",
  },
  {
    title: "17 lessons from 17",
    date: "2024-12-31",
    desc: "the most important things 2024 taught me",
    images: ["/writing/17-lessons.jpg"],
    href: "https://shayaanazeem.substack.com/p/17-lessons-from-17",
  },
];

export default function Writing() {
  return (
    <Layout active="/writing">
      <section className={styles.cards}>
        {POSTS.map((post) => (
          <a
            key={post.href}
            className={styles.card}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.shots}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={styles.shot}>
                  <Image
                    src={post.images[i % post.images.length]}
                    alt=""
                    width={120}
                    height={160}
                    sizes="60px"
                  />
                </span>
              ))}
            </span>
            <span className={styles.cardText}>
              <span className={styles.cardTitle}>
                {post.title}
                <span className={styles.cardBadge}>
                  <time dateTime={post.date}>{post.date}</time>
                </span>
              </span>
              <span className={styles.cardDesc}>{post.desc}</span>
            </span>
          </a>
        ))}
      </section>
    </Layout>
  );
}
