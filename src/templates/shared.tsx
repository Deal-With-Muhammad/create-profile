import type { Field, Member } from "@/lib/types";
import type { Kit, Style } from "./kit";

export const INK = "#111827";
export const BODY = "#374151";
export const MUTED = "#6B7280";
export const HAIRLINE = "#E5E7EB";
export const EMPTY = "#C4C9D0";
export const EMPTY_VALUE = "—";

/** Blends a hex colour towards white; t = 0 keeps the colour, 1 is white. */
export function tint(hex: string, t: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * t);
  const r = mix((n >> 16) & 255);
  const g = mix((n >> 8) & 255);
  const b = mix(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function valueOf(member: Member, field: Field): string {
  return (member.values[field.id] ?? "").trim();
}

export function headline(member: Member, fields: Field[]): string {
  return fields[0] ? valueOf(member, fields[0]) : "";
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

/**
 * Scales vertical rhythm with the number of rows: few fields get room to
 * breathe, and up to MAX_FIELDS still fit on one A4 page.
 */
export function density(count: number): number {
  if (count <= 3) return 1.45;
  if (count === 4) return 1.2;
  if (count === 5) return 1;
  if (count === 6) return 0.85;
  if (count <= 8) return 0.66;
  return 0.5;
}

interface PhotoProps {
  kit: Kit;
  src?: string;
  name: string;
  size: number;
  radius: number;
  background: string;
  color: string;
  ring?: { width: number; color: string };
}

export function Photo({
  kit: { View, Text, Image },
  src,
  name,
  size,
  radius,
  background,
  color,
  ring,
}: PhotoProps) {
  const inner = ring ? size - ring.width * 2 : size;
  const innerRadius = ring ? Math.max(radius - ring.width, 0) : radius;

  const body = src ? (
    // eslint-disable-next-line jsx-a11y/alt-text -- kit primitive; the DOM kit sets alt
    <Image
      src={src}
      style={{
        width: inner,
        height: inner,
        borderRadius: innerRadius,
        objectFit: "cover",
      }}
    />
  ) : (
    <View
      style={{
        width: inner,
        height: inner,
        borderRadius: innerRadius,
        backgroundColor: background,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {initials(name) ? (
        <Text
          style={{
            fontSize: inner * 0.3,
            fontWeight: 700,
            color,
            letterSpacing: 1,
          }}
        >
          {initials(name)}
        </Text>
      ) : null}
    </View>
  );

  if (!ring) return body;

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: ring.color,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {body}
    </View>
  );
}

export function Value({
  kit: { Text },
  value,
  style,
}: {
  kit: Kit;
  value: string;
  style: Style;
}) {
  return (
    <Text style={{ ...style, ...(value ? null : { color: EMPTY }) }}>
      {value || EMPTY_VALUE}
    </Text>
  );
}

export function pageLabel(footer: string, pageNumber: number): string {
  const prefix = footer.trim().toUpperCase();
  return prefix ? `${prefix}  •  PAGE ${pageNumber}` : `PAGE ${pageNumber}`;
}
