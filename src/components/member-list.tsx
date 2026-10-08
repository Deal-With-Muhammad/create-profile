"use client";

import { Button } from "@heroui/react";
import { Plus, UserRound } from "lucide-react";
import type { Field, Member } from "@/lib/types";
import { headline, initials } from "@/templates/shared";

interface MemberListProps {
  members: Member[];
  fields: Field[];
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

function MemberAvatar({ member, name, size }: { member: Member; name: string; size: string }) {
  return (
    <span
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 text-xs font-semibold text-neutral-600`}
    >
      {member.photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- local data URL
        <img src={member.photo} alt="" className="size-full object-cover" />
      ) : initials(name) ? (
        initials(name)
      ) : (
        <UserRound className="size-4 text-neutral-400" />
      )}
    </span>
  );
}

export function MemberList({
  members,
  fields,
  selectedId,
  onSelect,
  onAdd,
}: MemberListProps) {
  const subtitleField = fields[1];

  return (
    <div className="flex min-h-0 flex-col">
      <div className="flex items-center justify-between px-1 pb-3">
        <h2 className="text-sm font-semibold text-neutral-900">
          Members{" "}
          <span className="font-normal text-neutral-500">{members.length}</span>
        </h2>
        <Button size="sm" variant="secondary" onPress={onAdd}>
          <Plus className="size-4" />
          Add
        </Button>
      </div>

      {/* Horizontal strip on small screens, vertical list from lg up. */}
      <ul className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:flex-col lg:gap-1 lg:overflow-x-visible lg:overflow-y-auto">
        {members.map((member, index) => {
          const name = headline(member, fields);
          const subtitle = subtitleField
            ? (member.values[subtitleField.id] ?? "").trim()
            : "";
          const selected = member.id === selectedId;
          return (
            <li key={member.id} className="shrink-0 lg:shrink">
              <button
                type="button"
                onClick={() => onSelect(member.id)}
                aria-current={selected ? "true" : undefined}
                className={`flex w-44 cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent lg:w-full ${
                  selected
                    ? "bg-white shadow-sm ring-1 ring-neutral-200"
                    : "hover:bg-neutral-200/60"
                }`}
              >
                <MemberAvatar member={member} name={name} size="size-9" />
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-sm ${
                      name ? "font-medium text-neutral-900" : "text-neutral-400"
                    }`}
                  >
                    {name || "New member"}
                  </span>
                  <span className="block truncate text-xs text-neutral-500">
                    {subtitle || `Page ${index + 1}`}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
