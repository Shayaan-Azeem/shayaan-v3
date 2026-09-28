import FootnoteLink from "./FootnoteLink";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import BackpackLink from "../components/BackpackLink";
import articleStyles from "../forus/forus.module.css";
import styles from "./murph-e.module.css";
import ArticleBody from "./ArticleBody";
import AssemblyDiagram from "./AssemblyDiagram";

export default function MurphEView() {
  return (
    <main id="main-content" tabIndex={-1}>
      <nav className={articleStyles.navigation} aria-label="Article navigation">
        <BackpackLink href="/fieldnotes"><ArrowLeft size={16} aria-hidden="true" /> Fieldnotes</BackpackLink>
        <a href="https://devpost.com/software/arcade-l34jba" target="_blank" rel="noopener noreferrer">
          Devpost <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </nav>
      <div className={styles.openingModel}>
        <AssemblyDiagram />
      </div>
      <header className={articleStyles.hero}>
        <h1 className={articleStyles.heroTitle}>Murph-E Arcade</h1>
        <p className={articleStyles.heroMeta}>Hack the North 2026</p>
        <p className={`${articleStyles.heroMeta} ${styles.team}`}>
          Team: <a href="https://x.com/zanebeeai" target="_blank" rel="noopener noreferrer">Zane Beeai</a>,{" "}
          <a href="https://x.com/sahitid_" target="_blank" rel="noopener noreferrer">Sahiti Dasari</a>, and{" "}
          <a href="https://x.com/tpypan" target="_blank" rel="noopener noreferrer">Tony Pan</a>.
        </p>
      </header>
      <article className={styles.article} aria-label="Murph-E Arcade fieldnote">
        <div className={styles.prose}>
          <ArticleBody />
        </div>

        <section className={styles.footnotes} aria-label="Footnotes" role="doc-endnotes">
          <ol>
            <li id="murphy-note" tabIndex={-1}>
              Murphy’s law is usually phrased as “Anything that can go wrong will go wrong.” In <a href="https://clip.cafe/interstellar-2014/murphys-law/t/8" target="_blank" rel="noopener noreferrer"><em>Interstellar</em></a>, Cooper and his wife name their daughter Murphy (Murph) after it. Cooper gives it a more hopeful meaning: “Whatever can happen, will happen.” That’s the sense of possibility behind Murph-E. <FootnoteLink href="#murphy-note-ref" aria-label="Back to footnote reference" role="doc-backlink">↩</FootnoteLink>
            </li>
          </ol>
        </section>
        <footer className={styles.links}>
          <a href="https://www.youtube.com/watch?v=EvnDM0o6ku0" target="_blank" rel="noopener noreferrer">Demo <ArrowUpRight size={14} aria-hidden="true" /></a>
          <a href="https://devpost.com/software/arcade-l34jba" target="_blank" rel="noopener noreferrer">Devpost <ArrowUpRight size={14} aria-hidden="true" /></a>
        </footer>
      </article>
    </main>
  );
}
