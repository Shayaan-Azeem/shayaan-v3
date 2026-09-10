import type { Metadata } from "next";
import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../page.module.css";

export const metadata: Metadata = {
  title: "Philosophy — Shayaan Azeem",
  description: "Shayaan Azeem's philosophy on effort and ambition.",
};

export default function Philosophy() {
  return (
    <Layout active="/philosophy">
      <article className={styles.philosophy}>
        <p>One of my favorite quotes is by Charles Bukowski:</p>
        <blockquote className={styles.philosophyQuote}>
          &ldquo;If you&rsquo;re going to try, go all the way. Otherwise,
          don&rsquo;t even start&hellip; this could mean losing girlfriends,
          wives, relatives and maybe even your mind. It could mean not eating
          for three or four days. It could mean freezing on a park bench.
          It could mean jail. It could mean derision. It could mean mockery,
          isolation. Isolation is the gift. All the others are a test of your
          endurance, of how much you really want to do it. And you&rsquo;ll do
          it, despite rejection and the worst odds. And it will be better than
          anything else you can imagine&hellip; you&rsquo;ll be alone with the
          gods, and the nights will flame with fire. You will ride life
          straight to perfect laughter. It&rsquo;s the only good fight there
          is.&rdquo;
        </blockquote>
        <p>
          This quote perfectly captures how I feel about effort and ambition.
          Over the past few years, I&rsquo;ve failed a lot. I&rsquo;ve been told
          no more times than I can count. And yeah, it sucks. It&rsquo;s one of
          the worst feelings there is. But I also believe we only get one shot at
          life. We only have the time and energy to truly go after a handful of
          things. So when you do decide to chase something, I think you owe it to
          yourself to go all the way.
        </p>
        <figure className={styles.philosophyPhoto}>
          <Image
            src="/philosophy-jacket.jpg"
            alt="Shayaan wearing a black Arc'teryx jacket with the opening of the Charles Bukowski quote embroidered inside the hood"
            width={1378}
            height={1838}
            sizes="(max-width: 359px) calc(100vw - 40px), 320px"
          />
          <figcaption>
            A jacket my friend gifted me, with this quote on the hood.
          </figcaption>
        </figure>
      </article>
    </Layout>
  );
}
