import DatedEntryList from "../components/DatedEntryList";
import Layout from "../components/Layout";
import { POSTS } from "./data";

export default function Fieldnotes() {
  return (
    <Layout active="/fieldnotes">
      <DatedEntryList entries={POSTS} label="Writing" />
    </Layout>
  );
}
