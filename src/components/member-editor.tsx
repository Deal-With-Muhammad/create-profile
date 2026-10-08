"use client";

import { Button, Input, Label, TextField } from "@heroui/react";
import { ArrowDown, ArrowUp, Copy, Download, Trash2 } from "lucide-react";
import type { ProfilesActions } from "@/lib/use-profiles";
import type { DocSettings, Field, Member } from "@/lib/types";
import { headline } from "@/templates/shared";
import { ConfirmDialog } from "./confirm-dialog";
import { FieldsModal } from "./fields-modal";
import { PhotoPicker } from "./photo-picker";

interface MemberEditorProps {
  member: Member;
  index: number;
  total: number;
  fields: Field[];
  doc: DocSettings;
  actions: ProfilesActions;
  isExporting: boolean;
  onDownload: () => void;
}

export function MemberEditor({
  member,
  index,
  total,
  fields,
  doc,
  actions,
  isExporting,
  onDownload,
}: MemberEditorProps) {
  const name = headline(member, fields);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-500">
            Page {index + 1} of {total}
          </p>
          <h2 className="mt-0.5 truncate text-xl font-semibold text-neutral-900">
            {name || "New member"}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Move earlier"
            isDisabled={index === 0}
            onPress={() => actions.moveMember(member.id, -1)}
          >
            <ArrowUp className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Move later"
            isDisabled={index === total - 1}
            onPress={() => actions.moveMember(member.id, 1)}
          >
            <ArrowDown className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Duplicate member"
            onPress={() => actions.duplicateMember(member.id)}
          >
            <Copy className="size-4" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            aria-label="Download this profile"
            isPending={isExporting}
            onPress={onDownload}
          >
            <Download className="size-4" />
          </Button>
          <DeleteMemberButton
            name={name}
            onConfirm={() => actions.removeMember(member.id)}
          />
        </div>
      </div>

      <PhotoPicker
        photo={member.photo}
        onChange={(photo) => actions.setPhoto(member.id, photo)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Details</h3>
          <FieldsModal
            fields={fields}
            doc={doc}
            onSave={(next, text) => {
              actions.setFields(next);
              actions.setDoc(text);
            }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((field, i) => (
            <TextField
              // Re-key per member so the input resets when switching members.
              key={`${member.id}:${field.id}`}
              value={member.values[field.id] ?? ""}
              onChange={(value) => actions.setValue(member.id, field.id, value)}
              className={i === 0 ? "sm:col-span-2" : undefined}
            >
              <Label>{field.label}</Label>
              <Input
                variant="secondary"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            </TextField>
          ))}
        </div>
      </div>
    </div>
  );
}

function DeleteMemberButton({
  name,
  onConfirm,
}: {
  name: string;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      heading={`Delete ${name || "this member"}?`}
      body="Their photo and details will be removed. This can't be undone."
      confirmLabel="Delete"
      onConfirm={onConfirm}
    >
      <Button isIconOnly size="sm" variant="ghost" aria-label="Delete member">
        <Trash2 className="size-4" />
      </Button>
    </ConfirmDialog>
  );
}
