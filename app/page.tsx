import Image from "next/image";
import type { ReactNode } from "react";
import Layout from "./components/Layout";
import styles from "./page.module.css";

function Logo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      className={styles.inlineIcon}
      src={src}
      alt={alt}
      width={20}
      height={20}
    />
  );
}

function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <Layout>
      <p className={styles.paragraph}>
        I&rsquo;m a Software Engineer and student at the{" "}
        <Logo src="/waterloo.svg" alt="University of Waterloo" />
        University of Waterloo.
      </p>
      <p className={styles.paragraph}>
        Most recently at <Logo src="/forus.svg" alt="Forus" />
        Forus in New York, building AI systems that make medication faster and
        cheaper to get.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;m a scout at <Logo src="/crv.png" alt="CRV" />
        CRV, writing $25&ndash;100k cheques into pre-seed and seed startups.
      </p>
      <p className={styles.paragraph}>
        Before that, <Logo src="/revisiondojo.png" alt="RevisionDojo" />
        RevisionDojo (650k+ students), autonomous drones for forest fire
        detection, a <A href="https://wossrobotics.ca/">robotics team</A> ranked
        among the best in Canada, a{" "}
        <A href="https://www.teenbuilders.club/">community</A> for ambitious
        teenagers,{" "}
        <A href="https://apocalypse.hackclub.com/">
          Canada&rsquo;s largest high school hackathon
        </A>
        , and{" "}
        <A href="https://www.instagram.com/starthackclub/">@starthackclub</A> to
        100k followers.
      </p>
      <p className={styles.paragraph}>
        If you&rsquo;re building something interesting, say hi.
      </p>
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com.
      </p>
    </Layout>
  );
}
