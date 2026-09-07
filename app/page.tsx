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
        Most recently, I worked at <Logo src="/forus.svg" alt="Forus" />
        Forus in New York, building AI systems that help people access
        medication faster and more affordably.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;m a scout at <Logo src="/crv.png" alt="CRV" />
        CRV and love meeting people working on ambitious ideas.
      </p>
      <p className={styles.paragraph}>
        Before that, I engineered products used by more than 650,000 students at{" "}
        <Logo src="/revisiondojo.png" alt="RevisionDojo" />
        RevisionDojo, built autonomous drones for detecting forest fires, and
        started a <A href="https://wossrobotics.ca/">robotics team</A> that
        became one of the best in Canada.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;ve also built{" "}
        <A href="https://www.teenbuilders.club/">communities</A> for ambitious
        teenagers, organized{" "}
        <A href="https://apocalypse.hackclub.com/">
          Canada&rsquo;s largest high school hackathon
        </A>
        , raised over $50,000, and helped grow{" "}
        <A href="https://www.instagram.com/starthackclub/">@starthackclub</A> to
        100,000 followers.
      </p>
      <p className={styles.paragraph}>
        If you&rsquo;re building something interesting, I&rsquo;d love to hear
        from you.
      </p>
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com.
      </p>
    </Layout>
  );
}
