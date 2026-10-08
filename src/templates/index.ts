import type { FC } from "react";
import type { TemplateId } from "@/lib/types";
import { BannerTemplate } from "./banner";
import { ClassicTemplate } from "./classic";
import type { TemplateProps } from "./kit";
import { MinimalTemplate } from "./minimal";
import { SidebarTemplate } from "./sidebar";

export interface TemplateDef {
  id: TemplateId;
  name: string;
  Component: FC<TemplateProps>;
}

export const TEMPLATES: TemplateDef[] = [
  { id: "classic", name: "Classic", Component: ClassicTemplate },
  { id: "sidebar", name: "Sidebar", Component: SidebarTemplate },
  { id: "banner", name: "Banner", Component: BannerTemplate },
  { id: "minimal", name: "Minimal", Component: MinimalTemplate },
];

export function getTemplate(id: TemplateId): TemplateDef {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
