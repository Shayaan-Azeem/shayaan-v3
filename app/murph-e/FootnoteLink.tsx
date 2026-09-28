"use client";

import type { ComponentProps } from "react";
import { jumpToFootnote } from "./footnoteNavigation";

export default function FootnoteLink(props: ComponentProps<"a">) {
  return <a {...props} onClick={jumpToFootnote} />;
}
