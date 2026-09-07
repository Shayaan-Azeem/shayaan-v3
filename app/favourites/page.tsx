import Layout from "../components/Layout";
import styles from "../page.module.css";

const FAVOURITES = [
  {
    title: "The Bear",
    kind: "TV show",
    href: "https://www.fxnetworks.com/shows/the-bear",
  },
  {
    title: "Atomic Habits — James Clear",
    kind: "Book",
    href: "https://jamesclear.com/atomic-habits",
  },
  {
    title: "Do Hard Things — Casey Neistat",
    kind: "Video",
    href: "https://youtu.be/StMltAX0mp0",
  },
  {
    title: "Interstellar — Christopher Nolan",
    kind: "Movie",
    href: "https://www.warnerbros.com/movies/interstellar",
  },
  {
    title: "Forrest Gump — Robert Zemeckis",
    kind: "Movie",
    href: "https://www.paramount.com/movies/forrest-gump",
  },
  {
    title: "How to Do Philosophy — Paul Graham",
    kind: "Essay",
    href: "https://paulgraham.com/philosophy.html",
  },
  {
    title: "Meditations — Marcus Aurelius",
    kind: "Book",
    href: "https://www.penguinrandomhouse.com/books/566528/meditations-by-marcus-aurelius/",
  },
  {
    title: "The Lesson to Unlearn — Paul Graham",
    kind: "Essay",
    href: "https://paulgraham.com/lesson.html",
  },
  {
    title: "The Pursuit of Happyness — Gabriele Muccino",
    kind: "Movie",
    href: "https://www.sonypictures.com/movies/thepursuitofhappyness",
  },
  {
    title: "Some Thoughts on the Common Toad — George Orwell",
    kind: "Essay",
    href: "https://orwell.ru/library/articles/Common_Toad/english/e_ctoad",
  },
  {
    title: "Idea Generation — Sam Altman",
    kind: "Blog",
    href: "https://blog.samaltman.com/idea-generation",
  },
  {
    title: "What I Wish Someone Had Told Me — Sam Altman",
    kind: "Blog",
    href: "https://blog.samaltman.com/what-i-wish-someone-had-told-me",
  },
  {
    title: "Reject Advice — Naval Ravikant",
    kind: "Blog",
    href: "https://nav.al/reject-advice",
  },
  {
    title: "There's No Thinking Without Writing — Harsehaj S.",
    kind: "Short essay",
    href: "https://harsehaj.substack.com/p/theres-no-thinking-without-writing",
  },
  {
    title: "Why Read Dostoevsky — Fernando",
    kind: "Short essay",
    href: "https://fhur.me/posts/why-read-dostoevsky",
  },
];

export default function Favourites() {
  return (
    <Layout active="/favourites">
      <p className={styles.small}>content worth consuming.</p>
      <section className={styles.favourites}>
        {FAVOURITES.map((favourite) => (
          <a
            key={favourite.href}
            className={styles.favourite}
            href={favourite.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.favouriteTitle}>{favourite.title}</span>
            <span className={styles.cardBadge}>{favourite.kind}</span>
          </a>
        ))}
      </section>
    </Layout>
  );
}
