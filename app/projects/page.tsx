import Image from "next/image";
import Layout from "../components/Layout";
import styles from "../page.module.css";

const PROJECTS = [
  {
    title: "RevisionDojo",
    badge: "YCF24",
    desc: "built and shipped features used by 650k+ students and teachers across 180 countries.",
    images: ["/projects/revisiondojo.png"],
    href: "https://www.revisiondojo.com/",
  },
  {
    title: "tensorforest",
    badge: "project",
    desc: "drones that spot early forest fire risk with remote sensing, NDVI and onboard ML.",
    images: ["/projects/tensorforest.jpg"],
    href: "https://shayaanazeem.com/",
  },
  {
    title: "performativepuritytest.com",
    badge: "300k+ users",
    desc: "a purity test for the performative trend. went viral and trended on twitter for two days.",
    images: ["/projects/performativepurity.png"],
    href: "https://performativepuritytest.com/",
  },
  {
    title: "do-eve",
    badge: "won hackprinceton",
    desc: "an imessage agent that uses your laptop for you — opens apps, runs scripts, organizes files.",
    images: ["/projects/doeve.png"],
    href: "https://shayaanazeem.com/",
  },
  {
    title: "coach bob",
    badge: "won hackthenorth",
    desc: "street fighter irl. an AR pose-based fighting game scored in real time with gemini feedback.",
    images: ["/projects/coachbob.jpg"],
    href: "https://shayaanazeem.com/",
  },
  {
    title: "teen builders club",
    badge: "community",
    desc: "weekly coworking, demo nights and a space for ambitious young people to actually build.",
    images: ["/projects/teenbuildersclub.jpg"],
    href: "https://www.teenbuilders.club/",
  },
  {
    title: "white oaks robotics",
    badge: "2nd in ontario",
    desc: "started and scaled my school's team to 100+ members, ranked top 62/2400 worldwide.",
    images: ["/projects/vex.jpg"],
    href: "https://wossrobotics.ca/",
  },
  {
    title: "uwaterloo.network",
    badge: "project",
    desc: "a webring for waterloo friends :)",
    images: ["/projects/uwaterloonetwork.png"],
    href: "https://uwaterloo.network/",
  },
  {
    title: "shoppywrapped",
    badge: "won shopify hackathon",
    desc: "spotify wrapped but for your shopping, built on shopify's shop mini framework.",
    images: ["/projects/shoppy.png"],
    href: "https://shayaanazeem.com/",
  },
  {
    title: "vibetype",
    badge: "project",
    desc: "an ai writing sidekick in your browser that reads your open tabs to help you draft faster.",
    images: ["/projects/vibetype.png"],
    href: "https://shayaanazeem.com/",
  },
];

export default function Projects() {
  return (
    <Layout active="/projects">
      <section className={styles.cards}>
        {PROJECTS.map((project) => (
          <a
            key={project.title}
            className={styles.card}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span
              className={`${styles.shots} ${
                project.images.length === 1 ? styles.single : ""
              }`}
            >
              {project.images.map((image) => (
                <span key={image} className={styles.shot}>
                  <Image
                    src={image}
                    alt=""
                    width={120}
                    height={160}
                    sizes="60px"
                  />
                </span>
              ))}
            </span>
            <span className={styles.cardText}>
              <span className={styles.cardTitle}>
                {project.title}
                <span className={styles.cardBadge}>{project.badge}</span>
              </span>
              <span className={styles.cardDesc}>{project.desc}</span>
            </span>
          </a>
        ))}
      </section>
    </Layout>
  );
}
