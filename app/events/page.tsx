import type { Metadata } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Events — Shayaan Azeem",
  description: "Events hosted by Shayaan Azeem.",
};

const EVENTS = [
  {
    title: "Forus Game Night",
    date: "2026-08-13",
    image: "/events/forus-game-night.jpg",
    href: "https://partiful.com/e/oHSfqGaHyCnZClOx7FNX",
  },
  {
    title: "Forus × Thrive Capital: Mafia Night",
    date: "2026-08-06",
    image: "/events/forus-mafia-night.jpg",
    href: "https://partiful.com/e/zr95GkFlv9f1fNSqlr6w",
  },
  {
    title: "Soma Capital Summer Social",
    date: "2026-06-24",
    image: "/events/soma-summer-social.png",
    href: "https://partiful.com/e/09iPR2G33GLM4nCfLxE7",
  },
  {
    title: "Waterloo Dinner with Soma Capital",
    date: "2026-03-19",
    image: "/events/waterloo-soma-dinner.png",
    href: "https://luma.com/7v010r12",
  },
  {
    title: "Cursor @ Waterloo: Freeform",
    date: "2026-03-16",
    image: "/events/cursor-waterloo-freeform.png",
    href: "https://luma.com/wy1j9293",
  },
  {
    title: "Waterloo Dessert Builder Meetup w/ Cory Levy",
    date: "2026-01-21",
    image: "/events/waterloo-dessert-meetup.jpg",
    href: "https://partiful.com/e/U7jPfWJYKHV6vhvUad9y",
  },
  {
    title: "Cafe Cursor @ Waterloo",
    date: "2025-11-29",
    image: "/events/cafe-cursor-waterloo.avif",
    href: "https://luma.com/uwaterloo-1",
  },
];

const EVENT_GROUPS = Object.entries(
  EVENTS.reduce<Record<string, typeof EVENTS>>((groups, event) => {
    const year = event.date.slice(0, 4);
    groups[year] = [...(groups[year] ?? []), event];
    return groups;
  }, {}),
).sort(([firstYear], [secondYear]) => secondYear.localeCompare(firstYear));

function formatDate(date: string) {
  const [, month, day] = date.split("-");
  return `${day}/${month}`;
}

export default function Events() {
  return (
    <Layout active="/events">
      <p className={styles.eventsIntro}>
        To build a village, you need to be a villager. I&rsquo;m doing my best
        to play my part in building one. In my free time, I host dinners and
        events.
      </p>
      <section className={styles.writingSection} aria-label="Events">
        <div className={styles.writingList}>
          {EVENT_GROUPS.map(([year, events]) => (
            <div key={year} className={styles.writingYearGroup}>
              <span className={styles.writingYear}>{year}</span>
              <div className={styles.writingRows}>
                {events.map((event) => (
                  <a
                    key={event.href}
                    className={`${styles.card} ${styles.writingRow}`}
                    href={event.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span
                      className={`${styles.shots} ${styles.single} ${styles.eventShotsSquare}`}
                    >
                      <span className={styles.shot}>
                        <Image
                          src={event.image}
                          alt=""
                          width={120}
                          height={80}
                          sizes="62px"
                        />
                      </span>
                    </span>
                    <span className={styles.writingTitle}>{event.title}</span>
                    <time className={styles.writingDate} dateTime={event.date}>
                      {formatDate(event.date)}
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
