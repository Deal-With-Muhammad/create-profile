import type { TemplateProps } from "./kit";
import {
  BODY,
  MUTED,
  Photo,
  Value,
  density,
  headline,
  pageLabel,
  tint,
  valueOf,
} from "./shared";

/** Mirrors the original PowerPoint: centred photo, title, ruled rows. */
export function ClassicTemplate({
  kit,
  member,
  fields,
  doc,
  pageNumber,
}: TemplateProps) {
  const { Page, View, Text } = kit;
  const d = density(fields.length);
  const photo = 150 * Math.min(Math.max(d, 0.75), 1.1);
  const rule = {
    borderBottomWidth: 1.25,
    borderBottomColor: doc.accent,
    borderBottomStyle: "solid",
  } as const;

  return (
    <Page
      style={{
        paddingTop: 52 * Math.min(Math.max(d, 0.7), 1.1),
        paddingLeft: 64,
        paddingRight: 64,
        paddingBottom: 36,
        alignItems: "center",
      }}
    >
      <Photo
        kit={kit}
        src={member.photo}
        name={headline(member, fields)}
        size={photo}
        radius={photo / 2}
        background={tint(doc.accent, 0.92)}
        color={doc.accent}
        ring={{ width: 1.5, color: tint(doc.accent, 0.75) }}
      />

      <Text
        style={{
          marginTop: 26 * d,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: 1,
          color: doc.accent,
          textAlign: "center",
        }}
      >
        {doc.title.toUpperCase()}
      </Text>

      <View
        style={{
          width: "100%",
          marginTop: 30 * d,
          borderTopWidth: 1.25,
          borderTopColor: doc.accent,
          borderTopStyle: "solid",
        }}
      >
        {fields.map((field) => (
          <View
            key={field.id}
            style={{
              ...rule,
              paddingTop: 20 * d,
              paddingBottom: 20 * d,
              paddingLeft: 24,
              paddingRight: 24,
              alignItems: "center",
            }}
          >
            <View
              style={{
                position: "absolute",
                left: 4,
                top: 23 * d + 1,
                width: 5,
                height: 5,
                backgroundColor: doc.accent,
                transform: "rotate(45deg)",
              }}
            />
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: doc.accent,
                textAlign: "center",
              }}
            >
              {field.label.toUpperCase()}
            </Text>
            <Value
              kit={kit}
              value={valueOf(member, field)}
              style={{
                marginTop: 9 * d,
                fontSize: 15,
                color: BODY,
                textAlign: "center",
              }}
            />
          </View>
        ))}
      </View>

      <View style={{ flexGrow: 1 }} />

      <Text style={{ fontSize: 7, letterSpacing: 0.8, color: MUTED }}>
        {pageLabel(doc.footer, pageNumber)}
      </Text>
    </Page>
  );
}
