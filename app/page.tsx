import Image from "next/image";
import type { ReactNode } from "react";
import Layout from "./components/Layout";
import styles from "./page.module.css";

function Org({
  src,
  href,
  children,
}: {
  src?: string;
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
      {src ? (
        <Image
          className={styles.inlineIcon}
          src={src}
          alt=""
          width={20}
          height={20}
        />
      ) : null}
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
        I&rsquo;m an engineer and a student at the{" "}
        <Org href="https://uwaterloo.ca/">University of Waterloo</Org>.
      </p>
      <p className={styles.paragraph}>
        Most recently, I worked at{" "}
        <Org src="/forus.svg" href="https://forus.com/">
          Forus
        </Org>{" "}
        (backed by Thrive, GC and Accel) in New York, building AI to help people
        get medication cheaper and faster.
      </p>
      <p className={styles.paragraph}>
        I&rsquo;m a scout at{" "}
        <Org src="/crv.png" href="https://www.crv.com/">
          CRV
        </Org>
        , where I spend time with early stage founders and write cheques of
        $25k&ndash;100k into pre-seed/seed startups.
      </p>
      <p className={styles.paragraph}>
        In the past, I&rsquo;ve built products at{" "}
        <Org src="/revisiondojo.png" href="https://www.revisiondojo.com/">
          RevisionDojo
        </Org>
        ,{" "}
        <A href="https://tensorforest.com">
          autonomous drones to predict forest fires
        </A>
        ,{" "}
        <A href="https://www.oakvillenews.org/success/new-oakville-robotics-club-now-listed-among-best-in-the-world-9958475">
          one of the best
        </A>{" "}
        <A href="https://wossrobotics.ca/">robotics teams</A> in Canada,{" "}
        <A href="https://www.teenbuilders.club/">communities</A> for ambitious
        teenagers,{" "}
        <A href="https://apocalypse.hackclub.com/">
          Canada&rsquo;s largest high school hackathon
        </A>{" "}
        and{" "}
        <A href="https://www.instagram.com/starthackclub/">@starthackclub</A>.
      </p>
      <p className={styles.small}>
        You can reach me at shayaanazeem10 [at] gmail [dot] com or{" "}
        <A href="https://x.com/shayaan">X</A>.
      </p>
    </Layout>
  );
}
