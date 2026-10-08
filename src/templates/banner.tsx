import type { TemplateProps } from "./kit";
import {
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

const BAND = 170;
const PHOTO = 136;
const SIDE = 48;

/** Colour header band, overlapping photo, details in a two-column grid. */
export function BannerTemplate({
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
    <Page style={{ paddingBottom: 36 }}>
      <View
        style={{
          height: BAND,
          backgroundColor: doc.accent,
          paddingTop: 44,
          paddingLeft: SIDE,
          paddingRight: SIDE,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 3,
            color: "#FFFFFF",
          }}
        >
          {doc.title.toUpperCase()}
        </Text>
      </View>

      <View
        style={{
          position: "absolute",
          top: BAND - PHOTO / 2,
          left: SIDE,
        }}
      >
        <Photo
          kit={kit}
          src={member.photo}
          name={name}
          size={PHOTO}
          radius={PHOTO / 2}
          background={tint(doc.accent, 0.88)}
          color={doc.accent}
          ring={{ width: 5, color: "#FFFFFF" }}
        />
      </View>

      <View
        style={{
          paddingLeft: SIDE + PHOTO + 22,
          paddingRight: SIDE,
          paddingTop: 16,
          minHeight: PHOTO / 2 + 8,
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
            marginTop: 6,
            fontSize: 24,
            fontWeight: 700,
            color: INK,
            lineHeight: 1.15,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 44 * d,
          paddingLeft: SIDE,
          paddingRight: SIDE,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {details.map((field) => (
          <View
            key={field.id}
            style={{
              width: "48.5%",
              marginBottom: 14 * d,
              paddingTop: 16 * d,
              paddingBottom: 16 * d,
              paddingLeft: 16,
              paddingRight: 16,
              borderRadius: 6,
              backgroundColor: tint(doc.accent, 0.93),
            }}
          >
            <Text
              style={{
                fontSize: 8,
                fontWeight: 700,
                letterSpacing: 1.3,
                color: doc.accent,
              }}
            >
              {field.label.toUpperCase()}
            </Text>
            <Value
              kit={kit}
              value={valueOf(member, field)}
              style={{ marginTop: 8, fontSize: 14, color: INK }}
            />
          </View>
        ))}
      </View>

      <View style={{ flexGrow: 1 }} />

      <Text
        style={{
          fontSize: 7,
          letterSpacing: 0.8,
          color: MUTED,
          textAlign: "center",
        }}
      >
        {pageLabel(doc.footer, pageNumber)}
      </Text>
    </Page>
  );
}
