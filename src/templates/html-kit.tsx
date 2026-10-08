/* eslint-disable @next/next/no-img-element -- data URLs, rendered at print scale */
import type { Kit } from "./kit";
import { PAGE_HEIGHT, PAGE_WIDTH } from "./kit";

// react-pdf lays out with Yoga, where every node is a column flexbox that
// doesn't shrink by default. Matching those defaults keeps the preview faithful.
const box = {
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  position: "relative",
  boxSizing: "border-box",
  minWidth: 0,
} as const;

export const htmlKit: Kit = {
  Page: ({ style, children }) => (
    <div
      style={{
        ...box,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        overflow: "hidden",
        backgroundColor: "#FFFFFF",
        color: "#111827",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontSize: 12,
        lineHeight: 1.2,
        ...style,
      }}
    >
      {children}
    </div>
  ),
  View: ({ style, children }) => <div style={{ ...box, ...style }}>{children}</div>,
  Text: ({ style, children }) => (
    <div
      style={{
        boxSizing: "border-box",
        flexShrink: 0,
        overflowWrap: "anywhere",
        ...style,
      }}
    >
      {children}
    </div>
  ),
  Image: ({ src, style }) => (
    <img src={src} alt="" draggable={false} style={{ display: "block", ...style }} />
  ),
};
