import type { Metadata } from "next";
import DatedEntryList from "../components/DatedEntryList";
import Layout from "../components/Layout";
import styles from "../page.module.css";
import { EVENTS } from "./data";

export const metadata: Metadata = {
  title: "Events — Shayaan Azeem",
  description: "Events hosted by Shayaan Azeem.",
};

export default function Events() {
  return (
    <Layout active="/events">
      <p className={styles.eventsIntro}>
        To build a village, you need to be a villager. I&rsquo;m doing my best
        to play my part in building one. In my free time, I host dinners and
        events.
      </p>
      <DatedEntryList entries={EVENTS} label="Events" thumbnail="square" />
    </Layout>
  );
}
