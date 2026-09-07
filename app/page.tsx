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
        <Org src="/waterloo.svg" href="https://uwaterloo.ca/">
          University of Waterloo
        </Org>
        .
      </p>
      <p className={styles.paragraph}>
        Most recently at{" "}
        <Org src="/forus.svg" href="https://forus.com/">
          Forus
        </Org>{" "}
        in New York, building AI systems that make medication faster and cheaper
        to get.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;m a scout at{" "}
        <Org src="/crv.png" href="https://www.crv.com/">
          CRV
        </Org>
        , writing $25&ndash;100k cheques into pre-seed and seed startups.
      </p>
      <p className={styles.paragraph}>
        Before that,{" "}
        <Org src="/revisiondojo.png" href="https://www.revisiondojo.com/">
          RevisionDojo
        </Org>{" "}
        (650k+ students), autonomous drones for forest fire
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
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com.
      </p>
    </Layout>
  );
}
