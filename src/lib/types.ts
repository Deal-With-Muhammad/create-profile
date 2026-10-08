export interface Field {
  id: string;
  label: string;
}

export interface Member {
  id: string;
  /** Square JPEG data URL, already cropped and downscaled. */
  photo?: string;
  values: Record<string, string>;
}

export type TemplateId = "classic" | "sidebar" | "banner" | "minimal";

export interface DocSettings {
  title: string;
  footer: string;
  templateId: TemplateId;
  accent: string;
}

export interface ProfilesState {
  fields: Field[];
  members: Member[];
  doc: DocSettings;
}
