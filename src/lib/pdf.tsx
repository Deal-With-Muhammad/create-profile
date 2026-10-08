import type { Kit, Style } from "@/templates/kit";
import { getTemplate } from "@/templates";
import type { ProfilesState } from "./types";

/**
 * Builds the PDF in the browser. @react-pdf/renderer is ~1MB, so it is only
 * loaded the first time someone exports.
 */
export async function renderProfilesPdf(
  state: ProfilesState,
  memberIds?: string[],
): Promise<Blob> {
  const { pdf, Document, Page, View, Text, Image, Font } = await import(
    "@react-pdf/renderer"
  );

  // Default hyphenation splits names like "Muham-mad" across lines.
  Font.registerHyphenationCallback((word) => [word]);

  // The built-in PDF fonts are separate faces rather than weights.
  const pdfStyle = (style?: Style) => {
    if (!style) return undefined;
    const { fontWeight, ...rest } = style;
    const bold = fontWeight === "bold" || Number(fontWeight) >= 600;
    return {
      ...rest,
      fontFamily: bold ? "Helvetica-Bold" : "Helvetica",
    } as never;
  };

  const kit: Kit = {
    Page: ({ style, children }) => (
      <Page size="A4" style={pdfStyle({ fontSize: 12, color: "#111827", ...style })}>
        {children}
      </Page>
    ),
    View: ({ style, children }) => <View style={style as never}>{children}</View>,
    Text: ({ style, children }) => <Text style={pdfStyle(style)}>{children}</Text>,
    // eslint-disable-next-line jsx-a11y/alt-text -- PDF image, not DOM
    Image: ({ src, style }) => <Image src={src} style={style as never} />,
  };

  const { Component } = getTemplate(state.doc.templateId);
  const members = memberIds
    ? state.members.filter((m) => memberIds.includes(m.id))
    : state.members;

  const document = (
    <Document title={state.doc.title} creator="Member Profiles" producer="Member Profiles">
      {members.map((member) => (
        <Component
          key={member.id}
          kit={kit}
          member={member}
          fields={state.fields}
          doc={state.doc}
          pageNumber={state.members.indexOf(member) + 1}
        />
      ))}
    </Document>
  );

  return pdf(document).toBlob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari needs the URL to outlive the click handler.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

export function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-") || "member"
  );
}
