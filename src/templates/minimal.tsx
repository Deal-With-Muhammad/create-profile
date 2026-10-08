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

/** Document-style: photo beside the name, details in a two-column table. */
export function MinimalTemplate({
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
    <Page
      style={{
        paddingTop: 64,
        paddingBottom: 36,
        paddingLeft: 56,
        paddingRight: 56,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Photo
          kit={kit}
          src={member.photo}
          name={name}
          size={116}
          radius={10}
          background={tint(doc.accent, 0.9)}
          color={doc.accent}
        />
        <View style={{ flex: 1, marginLeft: 26 }}>
          <Text
            style={{
              fontSize: 8.5,
              fontWeight: 700,
              letterSpacing: 2,
              color: doc.accent,
            }}
          >
            {doc.title.toUpperCase()}
          </Text>
          <Value
            kit={kit}
            value={name}
            style={{
              marginTop: 10,
              fontSize: 26,
              fontWeight: 700,
              color: INK,
              lineHeight: 1.15,
            }}
          />
        </View>
      </View>

      <View
        style={{
          marginTop: 48 * d,
          borderTopWidth: 1.5,
          borderTopColor: doc.accent,
          borderTopStyle: "solid",
        }}
      >
        {details.map((field) => (
          <View
            key={field.id}
            style={{
              flexDirection: "row",
              paddingTop: 15 * d,
              paddingBottom: 15 * d,
              borderBottomWidth: 1,
              borderBottomColor: HAIRLINE,
              borderBottomStyle: "solid",
            }}
          >
            <Text
              style={{
                width: 160,
                flexShrink: 0,
                paddingTop: 3,
                paddingRight: 12,
                fontSize: 8.5,
                fontWeight: 700,
                letterSpacing: 1.2,
                color: MUTED,
              }}
            >
              {field.label.toUpperCase()}
            </Text>
            <Value
              kit={kit}
              value={valueOf(member, field)}
              style={{ flex: 1, fontSize: 14, color: INK }}
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
