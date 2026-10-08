import type { DocSettings, Field, Member, ProfilesState } from "./types";

export function createId(): string {
  // crypto.randomUUID only exists in secure contexts (https / localhost).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const ACCENTS = [
  { name: "Charcoal", value: "#1F2937" },
  { name: "Navy", value: "#1E3A5F" },
  { name: "Teal", value: "#0F5E63" },
  { name: "Forest", value: "#1F5135" },
  { name: "Maroon", value: "#7A1F2B" },
] as const;

export const DEFAULT_FIELDS: Field[] = [
  { id: "name", label: "Name" },
  { id: "branch", label: "Branch / Area" },
  { id: "member-no", label: "Member No." },
  { id: "position", label: "Position / Role" },
];

export const DEFAULT_DOC: DocSettings = {
  title: "Member Profile",
  footer: "Member Profile",
  templateId: "classic",
  accent: ACCENTS[0].value,
};

export const MAX_FIELDS = 10;

export function createMember(): Member {
  return { id: createId(), values: {} };
}

export function createInitialState(): ProfilesState {
  return {
    fields: DEFAULT_FIELDS,
    // Fixed id: this runs during prerender, and must match on the client.
    members: [{ id: "member-1", values: {} }],
    doc: DEFAULT_DOC,
  };
}

const SAMPLE_VALUES = [
  "Aisha Rahman",
  "North District",
  "MB-20418",
  "Branch Coordinator",
  "+1 555 0142",
  "aisha@example.org",
  "March 2021",
  "Active",
];

/** Used for template thumbnails so every design shows a filled-in example. */
export function sampleMember(fields: Field[]): Member {
  return {
    id: "sample",
    values: Object.fromEntries(
      fields.map((f, i) => [f.id, SAMPLE_VALUES[i % SAMPLE_VALUES.length]]),
    ),
  };
}
