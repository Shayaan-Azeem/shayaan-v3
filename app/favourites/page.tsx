import Layout from "../components/Layout";
import ViewPreview from "../components/ViewPreview";
import { groupBy } from "../lib/group";
import styles from "../page.module.css";
import { FAVOURITES } from "./data";

export default function Favourites() {
  const favouriteGroups = groupBy(FAVOURITES, (favourite) => favourite.kind);

  return (
    <Layout active="/favourites">
      <section className={styles.writingSection} aria-label="Favourites">
        <div className={styles.favouritesTable}>
          {favouriteGroups.map(([kind, favourites]) => (
            <div key={kind} className={styles.favouritesGroup}>
              <span className={styles.favouritesKind}>{kind}</span>
              <div className={styles.favouritesRows}>
                {favourites.map((favourite) => (
                  <ViewPreview
                    key={favourite.href}
                    src={favourite.preview}
                    alt={`Preview of ${favourite.title}`}
                    className={styles.favouriteRowPreview}
                    shape={favourite.previewShape}
                    fit={favourite.previewFit}
                  >
                    <a
                      className={styles.favouritesRow}
                      href={favourite.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className={styles.favouritesTitle}>
                        {favourite.title}
                      </span>
                      <span
                        className={styles.favouritesArrow}
                        aria-hidden="true"
                      >
                        <svg viewBox="0 0 16 16" fill="none">
                          <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
                        </svg>
                      </span>
                    </a>
                  </ViewPreview>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
