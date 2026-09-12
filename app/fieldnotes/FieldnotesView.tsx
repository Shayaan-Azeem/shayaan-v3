import DatedEntryList from "../components/DatedEntryList";
import Layout from "../components/Layout";
import { POSTS } from "./data";
import styles from "../page.module.css";

export default function Fieldnotes() {
  return (
    <Layout active="/fieldnotes" className={styles.fieldnotesPage}>
      <DatedEntryList entries={POSTS} label="Writing" />
    </Layout>
  );
}
