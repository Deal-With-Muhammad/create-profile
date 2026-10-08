import type { CSSProperties, FC, ReactNode } from "react";
import type { DocSettings, Field, Member } from "@/lib/types";

/**
 * Templates are written once against this tiny set of primitives. The preview
 * plugs in plain DOM elements, the export plugs in @react-pdf/renderer, so what
 * you see on screen is laid out by the same code that produces the PDF.
 *
 * Only use style properties both sides understand: flexbox, explicit
 * border{Side}{Width,Color,Style}, padding/margin longhands, absolute
 * positioning, and numeric sizes (1 unit = 1pt in the PDF = 1px on the A4
 * preview canvas).
 */
export type Style = CSSProperties;

export interface Kit {
  Page: FC<{ style?: Style; children?: ReactNode }>;
  View: FC<{ style?: Style; children?: ReactNode }>;
  Text: FC<{ style?: Style; children?: ReactNode }>;
  Image: FC<{ src: string; style?: Style }>;
}

export interface TemplateProps {
  kit: Kit;
  member: Member;
  fields: Field[];
  doc: DocSettings;
  pageNumber: number;
}

/** A4 in points. */
export const PAGE_WIDTH = 595.28;
export const PAGE_HEIGHT = 841.89;
