"use client";

import { Check } from "lucide-react";
import { ACCENTS, sampleMember } from "@/lib/defaults";
import type { DocSettings, Field, Member } from "@/lib/types";
import { TEMPLATES } from "@/templates";
import { ScaledPage } from "./scaled-page";

interface DesignPickerProps {
  doc: DocSettings;
  fields: Field[];
  member: Member;
  onChange: (patch: Partial<DocSettings>) => void;
}

export function DesignPicker({ doc, fields, member, onChange }: DesignPickerProps) {
  // Show the selected member if they've started filling in details, otherwise
  // an example, so the thumbnails never look empty.
  const hasContent =
    !!member.photo || Object.values(member.values).some((v) => v.trim());
  const thumbMember = hasContent ? member : sampleMember(fields);

  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Template" className="grid grid-cols-4 gap-2.5">
        {TEMPLATES.map((t) => {
          const selected = t.id === doc.templateId;
          return (
            <button
              key={t.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange({ templateId: t.id })}
              className="group flex cursor-pointer flex-col items-center gap-1.5 outline-none"
            >
              <span
                className={`relative block w-full overflow-hidden rounded-lg bg-white ring-offset-2 transition ${
                  selected
                    ? "ring-2 ring-accent"
                    : "ring-1 ring-neutral-200 group-hover:ring-neutral-400"
                } group-focus-visible:ring-2 group-focus-visible:ring-accent`}
              >
                <ScaledPage
                  member={thumbMember}
                  fields={fields}
                  doc={{ ...doc, templateId: t.id }}
                  pageNumber={1}
                />
                {selected && (
                  <span className="absolute right-1.5 top-1.5 flex size-5 items-center justify-center rounded-full bg-accent text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                )}
              </span>
              <span
                className={`text-xs ${
                  selected ? "font-semibold text-neutral-900" : "text-neutral-600"
                }`}
              >
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-neutral-500">Colour</span>
        <div role="group" aria-label="Colour" className="flex gap-2">
          {ACCENTS.map((a) => {
            const selected = a.value === doc.accent;
            return (
              <button
                key={a.value}
                type="button"
                aria-pressed={selected}
                aria-label={a.name}
                title={a.name}
                onClick={() => onChange({ accent: a.value })}
                className={`flex size-7 cursor-pointer items-center justify-center rounded-full outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-accent ${
                  selected ? "ring-2 ring-neutral-900" : "hover:scale-110"
                }`}
                style={{ backgroundColor: a.value }}
              >
                {selected && <Check className="size-3.5 text-white" strokeWidth={3} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
