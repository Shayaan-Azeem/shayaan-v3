import Image from "next/image";
import type { ReactNode } from "react";
import Layout from "./components/Layout";
import styles from "./page.module.css";

function Org({
  src,
  href,
  children,
}: {
  src: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      className={styles.org}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        className={styles.inlineIcon}
        src={src}
        alt=""
        width={20}
        height={20}
      />
      {children}
    </a>
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <Layout>
      <p className={styles.paragraph}>
        I&rsquo;m a Software Engineer and student at the{" "}
        <Org src="/waterloo.svg" href="https://uwaterloo.ca/">
          University of Waterloo
        </Org>
        .
      </p>
      <p className={styles.paragraph}>
        Most recently, I worked at{" "}
        <Org src="/forus.svg" href="https://forus.com/">
          Forus
        </Org>{" "}
        in New York, building an AI-powered network that helps people access
        medication faster and more affordably.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;m a scout at{" "}
        <Org src="/crv.png" href="https://www.crv.com/">
          Charles River Ventures
        </Org>
        , where I spend time with early stage founders and write cheques of
        $25k&ndash;100k into pre-seed/seed startups.
      </p>
      <p className={styles.paragraph}>
        In the past, I&rsquo;ve built products at{" "}
        <Org src="/revisiondojo.png" href="https://www.revisiondojo.com/">
          RevisionDojo
        </Org>
        , built autonomous drones for predicting forest fires, started a{" "}
        <A href="https://wossrobotics.ca/">robotics team</A> that{" "}
        <A href="https://www.oakvillenews.org/success/new-oakville-robotics-club-now-listed-among-best-in-the-world-9958475">
          became one of the best in Canada
        </A>
        , built <A href="https://www.teenbuilders.club/">communities</A> for
        ambitious teenagers, organized{" "}
        <A href="https://apocalypse.hackclub.com/">
          Canada&rsquo;s largest high school hackathon
        </A>
        , and grew{" "}
        <A href="https://www.instagram.com/starthackclub/">@starthackclub</A> to
        100,000 followers.
      </p>
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com or{" "}
        <A href="https://x.com/shayaan">X</A>.
      </p>
    </Layout>
  );
}
