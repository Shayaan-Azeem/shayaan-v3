import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../page.module.css";

const POSTS = [
  {
    title: "2025 Wrapped: In Pursuit of Global Minima",
    date: "2025-12-31",
    desc: "year recap, content recommendations, things i liked",
    images: [
      "/fieldnotes/2025-wrapped-1.jpg",
      "/fieldnotes/2025-wrapped-2.jpg",
      "/fieldnotes/2025-wrapped-3.jpg",
    ],
    href: "https://shayaanazeem.substack.com/p/2025-wrapped-in-pursuit-of-global",
  },
  {
    title: "No Regrets",
    date: "2025-05-21",
    desc: "everything i'm not made me everything i am",
    images: ["/fieldnotes/no-regrets.jpg"],
    href: "https://shayaanazeem.substack.com/p/no-regrets",
  },
  {
    title: "17 Lessons From 17",
    date: "2024-12-31",
    desc: "the most important things 2024 taught me",
    images: ["/fieldnotes/17-lessons.jpg"],
    href: "https://shayaanazeem.substack.com/p/17-lessons-from-17",
  },
];

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

export default function Fieldnotes() {
  const postGroups = Object.entries(
    POSTS.reduce<Record<string, typeof POSTS>>((groups, post) => {
      const year = post.date.slice(0, 4);
      groups[year] = [...(groups[year] ?? []), post];
      return groups;
    }, {}),
  ).sort(([firstYear], [secondYear]) =>
    secondYear.localeCompare(firstYear),
  );

  return (
    <Layout active="/fieldnotes">
      <section className={styles.writingSection} aria-label="Writing">
        <div className={styles.writingList}>
          {postGroups.map(([year, posts]) => (
            <div key={year} className={styles.writingYearGroup}>
              <span className={styles.writingYear}>{year}</span>
              <div className={styles.writingRows}>
                {posts.map((post) => (
                  <a
                    key={post.href}
                    className={`${styles.card} ${styles.writingRow}`}
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className={`${styles.shots} ${
                        post.images.length === 1 ? styles.single : ""
                      }`}
                    >
                      {post.images.map((image) => (
                        <span key={image} className={styles.shot}>
                          <Image
                            src={image}
                            alt=""
                            width={120}
                            height={160}
                            sizes="60px"
                          />
                        </span>
                      ))}
                    </span>
                    <span className={styles.writingTitle}>{post.title}</span>
                    <time className={styles.writingDate} dateTime={post.date}>
                      {formatDate(post.date)}
                    </time>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
