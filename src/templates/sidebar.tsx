import type { TemplateProps } from "./kit";
import {
  HAIRLINE,
  INK,
  MUTED,
  Photo,
  Value,
  density,
  headline,
  pageLabel,
  tint,
  valueOf,
} from "./shared";

/** Solid colour column with the photo, details listed on the right. */
export function SidebarTemplate({
  kit,
  member,
  fields,
  doc,
  pageNumber,
}: TemplateProps) {
  const { Page, View, Text } = kit;
  const name = headline(member, fields);
  const details = fields.slice(1);
  const d = density(details.length);

  return (
    <Page style={{ flexDirection: "row" }}>
      <View
        style={{
          width: 200,
          backgroundColor: doc.accent,
          paddingTop: 60,
          paddingBottom: 36,
          paddingLeft: 30,
          paddingRight: 30,
          alignItems: "center",
        }}
      >
        <Photo
          kit={kit}
          src={member.photo}
          name={name}
          size={140}
          radius={12}
          background={tint(doc.accent, 0.85)}
          color={doc.accent}
          ring={{ width: 4, color: "#FFFFFF" }}
        />
        <Text
          style={{
            marginTop: 24,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: 2,
            color: tint(doc.accent, 0.65),
            textAlign: "center",
          }}
        >
          {doc.title.toUpperCase()}
        </Text>
        <View style={{ flexGrow: 1 }} />
        <Text
          style={{
            fontSize: 7,
            letterSpacing: 0.8,
            color: tint(doc.accent, 0.6),
            textAlign: "center",
          }}
        >
          {pageLabel(doc.footer, pageNumber)}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          paddingTop: 72,
          paddingBottom: 36,
          paddingLeft: 44,
          paddingRight: 48,
        }}
      >
        <Text
          style={{
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: 1.6,
            color: MUTED,
          }}
        >
          {(fields[0]?.label ?? "").toUpperCase()}
        </Text>
        <Value
          kit={kit}
          value={name}
          style={{
            marginTop: 8,
            fontSize: 28,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.15,
          }}
        />

        <View style={{ marginTop: 36 * d }}>
          {details.map((field) => (
            <View
              key={field.id}
              style={{
                paddingTop: 16 * d,
                paddingBottom: 16 * d,
                borderTopWidth: 1,
                borderTopColor: HAIRLINE,
                borderTopStyle: "solid",
              }}
            >
              <Text
                style={{
                  fontSize: 8.5,
                  fontWeight: 700,
                  letterSpacing: 1.4,
                  color: doc.accent,
                }}
              >
                {field.label.toUpperCase()}
              </Text>
              <Value
                kit={kit}
                value={valueOf(member, field)}
                style={{ marginTop: 7, fontSize: 15, color: INK }}
              />
            </View>
          ))}
        </View>
      </View>
    </Page>
  );
}
