import type { ReactNode } from "react";
import Layout from "./components/Layout";
import styles from "./page.module.css";

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
        hi, my name is shayaan, i&rsquo;m a software engineer and a student at
        the university of waterloo
      </p>
      <p className={styles.paragraph}>
        i was most recently an engineer in nyc at Forus (backed by Thrive, GC,
        Accel and BCV), building the ai network to help people get medicine
        cheaper, faster and easier
      </p>
      <p className={styles.paragraph}>
        i&rsquo;m excited about startups and early stage companies, and
        i&rsquo;m a scout at CRV. if you&rsquo;re building something cool and
        want to chat, reach me at shayaanazeem10 [at] gmail [dot] com
      </p>
      <p className={styles.paragraph}>
        some cool things i&rsquo;ve worked on in the past include: engineering
        at revisiondojo, an edtech platform used by 650k+ students/teachers
        across 180 countries, building autonomous drones to predict forest
        fires, building a{" "}
        <A href="https://www.teenbuilders.club/">community</A> for
        cracked/ambitious teenagers building cool sh*t, growth intern at{" "}
        <A href="https://hackclub.com/">hack club</A>, growing{" "}
        <A href="https://www.instagram.com/starthackclub/">@starthackclub</A> to
        100k followers, organizing{" "}
        <A href="https://apocalypse.hackclub.com/">
          canada&rsquo;s largest high school hackathon
        </A>{" "}
        and raising $50k for it, founding the{" "}
        <A href="https://wossrobotics.ca/">robotics club</A> at my hs which
        ranked top 62/2400 in the world, running a summer camp to teach kids how
        to code, and taking bronze (3rd place) at the{" "}
        <A href="https://wro-association.org/">canadian world robot olympiad</A>
      </p>
    </Layout>
  );
}
