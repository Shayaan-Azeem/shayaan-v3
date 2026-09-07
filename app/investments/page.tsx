import Layout from "../components/Layout";
import styles from "../page.module.css";

const INVESTMENTS = [
  { name: "Company one", href: "https://example.com" },
];

export default function Investments() {
  return (
    <Layout active="/investments">
      <section className={styles.list}>
        {INVESTMENTS.map((company) => (
          <div key={company.name} className={styles.item}>
            <a
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.itemTitle}
            >
              {company.name}
            </a>
          </div>
        ))}
      </section>
    </Layout>
  );
}
