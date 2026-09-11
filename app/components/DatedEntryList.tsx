import Image from "next/image";
import { groupBy } from "../lib/group";
import styles from "../page.module.css";

export type DatedEntry = {
  title: string;
  /** ISO date, e.g. 2025-12-31 */
  date: string;
  href: string;
  images: string[];
};

const THUMBNAIL = {
  stack: { width: 120, height: 160, sizes: "60px" },
  square: { width: 120, height: 80, sizes: "62px" },
};

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

export default function DatedEntryList({
  entries,
  label,
  thumbnail = "stack",
}: {
  entries: DatedEntry[];
  label: string;
  thumbnail?: keyof typeof THUMBNAIL;
}) {
  const yearGroups = groupBy(entries, (entry) => entry.date.slice(0, 4)).sort(
    ([firstYear], [secondYear]) => secondYear.localeCompare(firstYear),
  );
  const { width, height, sizes } = THUMBNAIL[thumbnail];

  return (
    <section className={styles.writingSection} aria-label={label}>
      <div className={styles.writingList}>
        {yearGroups.map(([year, yearEntries]) => (
          <div key={year} className={styles.writingYearGroup}>
            <span className={styles.writingYear}>{year}</span>
            <div className={styles.writingRows}>
              {yearEntries.map((entry) => (
                <a
                  key={entry.href}
                  className={`${styles.card} ${styles.writingRow}`}
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span
                    className={`${styles.shots} ${
                      entry.images.length === 1 ? styles.single : ""
                    } ${
                      thumbnail === "square" ? styles.eventShotsSquare : ""
                    }`}
                  >
                    {entry.images.map((image) => (
                      <span key={image} className={styles.shot}>
                        <Image
                          src={image}
                          alt=""
                          width={width}
                          height={height}
                          sizes={sizes}
                        />
                      </span>
                    ))}
                  </span>
                  <span className={styles.writingTitle}>{entry.title}</span>
                  <time className={styles.writingDate} dateTime={entry.date}>
                    {formatDate(entry.date)}
                  </time>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
