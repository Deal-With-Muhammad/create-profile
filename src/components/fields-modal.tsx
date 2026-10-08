"use client";

import { Button, Input, Label, Modal, TextField } from "@heroui/react";
import { ArrowDown, ArrowUp, Plus, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { MAX_FIELDS, createId } from "@/lib/defaults";
import type { DocSettings, Field } from "@/lib/types";

interface FieldsModalProps {
  fields: Field[];
  doc: DocSettings;
  onSave: (fields: Field[], doc: Pick<DocSettings, "title" | "footer">) => void;
}

/**
 * Edits the field list shared by every member, plus the page title/footer.
 * Works on a draft so Cancel really cancels.
 */
export function FieldsModal({ fields, doc, onSave }: FieldsModalProps) {
  const [isOpen, setOpen] = useState(false);
  const [draft, setDraft] = useState<Field[]>(fields);
  const [title, setTitle] = useState(doc.title);
  const [footer, setFooter] = useState(doc.footer);

  function open() {
    setDraft(fields);
    setTitle(doc.title);
    setFooter(doc.footer);
    setOpen(true);
  }

  function move(index: number, delta: -1 | 1) {
    const to = index + delta;
    if (to < 0 || to >= draft.length) return;
    const next = [...draft];
    [next[index], next[to]] = [next[to], next[index]];
    setDraft(next);
  }

  function save() {
    const cleaned = draft
      .map((f) => ({ ...f, label: f.label.trim() }))
      .filter((f) => f.label);
    if (cleaned.length === 0) return;
    onSave(cleaned, { title: title.trim(), footer: footer.trim() });
    setOpen(false);
  }

  const canAdd = draft.length < MAX_FIELDS;
  const hasLabel = draft.some((f) => f.label.trim());

  return (
    <>
      <Button variant="secondary" size="sm" onPress={open}>
        <SlidersHorizontal className="size-4" />
        Edit fields
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Modal.Backdrop>
          <Modal.Container size="md" scroll="inside">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Fields & page text</Modal.Heading>
                <p className="text-sm text-neutral-500">
                  Changes apply to every member. The first field is used as
                  the main heading in most templates.
                </p>
              </Modal.Header>

              <Modal.Body className="flex flex-col gap-6">
                <section className="flex flex-col gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Fields
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {draft.map((field, index) => (
                      <li key={field.id} className="flex items-center gap-1.5">
                        <TextField
                          aria-label={`Field ${index + 1} name`}
                          value={field.label}
                          onChange={(label) =>
                            setDraft(
                              draft.map((f) =>
                                f.id === field.id ? { ...f, label } : f,
                              ),
                            )
                          }
                          className="flex-1"
                        >
                          <Input placeholder="Field name" />
                        </TextField>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          aria-label="Move up"
                          isDisabled={index === 0}
                          onPress={() => move(index, -1)}
                        >
                          <ArrowUp className="size-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          aria-label="Move down"
                          isDisabled={index === draft.length - 1}
                          onPress={() => move(index, 1)}
                        >
                          <ArrowDown className="size-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          aria-label={`Remove ${field.label || "field"}`}
                          isDisabled={draft.length === 1}
                          onPress={() =>
                            setDraft(draft.filter((f) => f.id !== field.id))
                          }
                        >
                          <X className="size-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="tertiary"
                    size="sm"
                    className="self-start"
                    isDisabled={!canAdd}
                    onPress={() =>
                      setDraft([...draft, { id: createId(), label: "" }])
                    }
                  >
                    <Plus className="size-4" />
                    {canAdd ? "Add field" : `Up to ${MAX_FIELDS} fields fit on a page`}
                  </Button>
                </section>

                <section className="flex flex-col gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Page text
                  </h3>
                  <TextField value={title} onChange={setTitle}>
                    <Label>Page title</Label>
                    <Input placeholder="Member Profile" />
                  </TextField>
                  <TextField value={footer} onChange={setFooter}>
                    <Label>Footer</Label>
                    <Input placeholder="Organisation name" />
                  </TextField>
                </section>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="secondary" onPress={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onPress={save} isDisabled={!hasLabel}>
                  Save changes
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}
