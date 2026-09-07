import Layout from "../components/Layout";
import styles from "../page.module.css";

const FAVOURITES = [{ name: "Something I love", href: "https://example.com" }];

export default function Favourites() {
  return (
    <Layout active="/favourites">
      <section className={styles.list}>
        {FAVOURITES.map((favourite) => (
          <div key={favourite.name} className={styles.item}>
            <a
              href={favourite.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.itemTitle}
            >
              {favourite.name}
            </a>
          </div>
        ))}
      </section>
    </Layout>
  );
}
