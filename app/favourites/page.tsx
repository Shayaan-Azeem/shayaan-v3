import Layout from "../components/Layout";
import ViewPreview from "../components/ViewPreview";
import styles from "../page.module.css";

type Favourite = {
  title: string;
  kind: string;
  href: string;
  preview: string;
  previewShape?: "landscape" | "portrait" | "square";
  previewFit?: "cover" | "contain";
};

const FAVOURITES: Favourite[] = [
  {
    title: "The Bear",
    kind: "TV show",
    href: "https://www.fxnetworks.com/shows/the-bear",
    preview: "/previews/favourites/the-bear.jpg",
    previewShape: "portrait",
  },
  {
    title: "Atomic Habits — James Clear",
    kind: "Book",
    href: "https://jamesclear.com/atomic-habits",
    preview: "/previews/favourites/atomic-habits.jpg",
    previewShape: "portrait",
    previewFit: "contain",
  },
  {
    title: "Do Hard Things — Casey Neistat",
    kind: "Video",
    href: "https://youtu.be/StMltAX0mp0",
    preview: "/previews/favourites/do-hard-things.jpg",
  },
  {
    title: "Interstellar — Christopher Nolan",
    kind: "Movie",
    href: "https://www.warnerbros.com/movies/interstellar",
    preview: "/previews/favourites/interstellar.jpg",
    previewShape: "portrait",
  },
  {
    title: "Forrest Gump — Robert Zemeckis",
    kind: "Movie",
    href: "https://www.paramount.com/movies/forrest-gump",
    preview: "/previews/favourites/forrest-gump.jpg",
    previewShape: "portrait",
  },
  {
    title: "How to Do Philosophy — Paul Graham",
    kind: "Essay",
    href: "https://paulgraham.com/philosophy.html",
    preview: "/previews/favourites/paul-graham.jpg",
    previewShape: "portrait",
  },
  {
    title: "Meditations — Marcus Aurelius",
    kind: "Book",
    href: "https://www.penguinrandomhouse.com/books/566528/meditations-by-marcus-aurelius/",
    preview: "/previews/favourites/meditations.jpg",
    previewShape: "portrait",
  },
  {
    title: "The Lesson to Unlearn — Paul Graham",
    kind: "Essay",
    href: "https://paulgraham.com/lesson.html",
    preview: "/previews/favourites/paul-graham.jpg",
    previewShape: "portrait",
  },
  {
    title: "The Pursuit of Happyness — Gabriele Muccino",
    kind: "Movie",
    href: "https://www.sonypictures.com/movies/thepursuitofhappyness",
    preview: "/previews/favourites/pursuit-of-happyness.jpg",
    previewShape: "portrait",
  },
  {
    title: "Some Thoughts on the Common Toad — George Orwell",
    kind: "Essay",
    href: "https://orwell.ru/library/articles/Common_Toad/english/e_ctoad",
    preview: "/previews/favourites/george-orwell.jpg",
    previewShape: "portrait",
  },
  {
    title: "Idea Generation — Sam Altman",
    kind: "Blog",
    href: "https://blog.samaltman.com/idea-generation",
    preview: "/previews/favourites/sam-altman.jpg",
    previewShape: "portrait",
  },
  {
    title: "What I Wish Someone Had Told Me — Sam Altman",
    kind: "Blog",
    href: "https://blog.samaltman.com/what-i-wish-someone-had-told-me",
    preview: "/previews/favourites/sam-altman.jpg",
    previewShape: "portrait",
  },
  {
    title: "Reject Advice — Naval Ravikant",
    kind: "Blog",
    href: "https://nav.al/reject-advice",
    preview: "/previews/favourites/naval.png",
    previewShape: "square",
  },
  {
    title: "There's No Thinking Without Writing — Harsehaj S.",
    kind: "Short essay",
    href: "https://harsehaj.substack.com/p/theres-no-thinking-without-writing",
    preview: "/previews/favourites/harsehaj.jpg",
    previewShape: "portrait",
  },
  {
    title: "Why Read Dostoevsky — Fernando",
    kind: "Short essay",
    href: "https://fhur.me/posts/why-read-dostoevsky",
    preview: "/previews/favourites/dostoevsky.jpg",
    previewShape: "square",
  },
];

export default function Favourites() {
  const favouriteGroups = Object.entries(
    FAVOURITES.reduce<Record<string, typeof FAVOURITES>>(
      (groups, favourite) => {
        groups[favourite.kind] = [
          ...(groups[favourite.kind] ?? []),
          favourite,
        ];
        return groups;
      },
      {},
    ),
  );

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
