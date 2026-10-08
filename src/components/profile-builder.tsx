"use client";

import { Button, Card, toast } from "@heroui/react";
import { FileDown, RotateCcw } from "lucide-react";
import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog";
import { downloadBlob, renderProfilesPdf, slugify } from "@/lib/pdf";
import { useProfiles } from "@/lib/use-profiles";
import { headline } from "@/templates/shared";
import { DesignPicker } from "./design-picker";
import { MemberEditor } from "./member-editor";
import { MemberList } from "./member-list";
import { ScaledPage } from "./scaled-page";

export function ProfileBuilder() {
  const { state, selected, hydrated, saveStatus, actions } = useProfiles();
  const [exporting, setExporting] = useState<"all" | "one" | null>(null);

  const { members, fields, doc } = state;
  const selectedIndex = members.indexOf(selected);

  async function exportPdf(scope: "all" | "one") {
    setExporting(scope);
    try {
      const blob = await renderProfilesPdf(
        state,
        scope === "one" ? [selected.id] : undefined,
      );
      const filename =
        scope === "one"
          ? `${slugify(headline(selected, fields) || "member")}-profile.pdf`
          : `${slugify(doc.title || "member-profiles")}.pdf`;
      downloadBlob(blob, filename);
      toast.success("PDF downloaded", {
        description:
          scope === "one"
            ? filename
            : `${members.length} ${members.length === 1 ? "page" : "pages"} · ${filename}`,
      });
    } catch (error) {
      console.error(error);
      toast.danger("Couldn't create the PDF", {
        description: "Please try again. If it keeps failing, try removing large photos.",
      });
    } finally {
      setExporting(null);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
              MP
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-base font-semibold text-neutral-900">
                Member Profiles
              </h1>
              <p className="hidden text-xs text-neutral-500 sm:block">
                {saveStatus === "failed"
                  ? "Couldn't save: changes won't survive a refresh"
                  : "Saved in this browser"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ResetButton onReset={actions.reset} />
            <Button
              isPending={exporting === "all"}
              isDisabled={!hydrated || exporting !== null}
              onPress={() => exportPdf("all")}
            >
              <FileDown className="size-4" />
              <span className="sm:hidden">PDF</span>
              <span className="hidden sm:inline">
                Download PDF
                {members.length > 1 ? ` (${members.length})` : ""}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_minmax(0,440px)]">
        <aside className="lg:sticky lg:top-22 lg:max-h-[calc(100dvh-7rem)] lg:self-start">
          <MemberList
            members={members}
            fields={fields}
            selectedId={selected.id}
            onSelect={actions.select}
            onAdd={actions.addMember}
          />
        </aside>

        <Card className="self-start">
          <Card.Content className="p-2 sm:p-4">
            <MemberEditor
              member={selected}
              index={selectedIndex}
              total={members.length}
              fields={fields}
              doc={doc}
              actions={actions}
              isExporting={exporting === "one"}
              onDownload={() => exportPdf("one")}
            />
          </Card.Content>
        </Card>

        <section
          aria-label="Design and preview"
          className="flex flex-col gap-4 lg:col-start-2 xl:sticky xl:top-22 xl:col-start-3 xl:row-start-1 xl:self-start"
        >
          <Card>
            <Card.Header className="px-2 pt-2 sm:px-4 sm:pt-4">
              <Card.Title className="text-sm">Template</Card.Title>
            </Card.Header>
            <Card.Content className="px-2 pb-2 sm:px-4 sm:pb-4">
              <DesignPicker
                doc={doc}
                fields={fields}
                member={selected}
                onChange={actions.setDoc}
              />
            </Card.Content>
          </Card>

          <div>
            <div className="mb-2 flex items-center justify-between px-1">
              <h2 className="text-sm font-semibold text-neutral-900">Preview</h2>
              <span className="text-xs text-neutral-500">
                A4 · page {selectedIndex + 1} of {members.length}
              </span>
            </div>
            <div className="mx-auto w-full max-w-[440px] overflow-hidden rounded-md xl:w-[max(300px,calc((100dvh-30rem)*0.7071))] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_8px_24px_rgba(0,0,0,0.06)] ring-1 ring-neutral-200">
              <ScaledPage
                member={selected}
                fields={fields}
                doc={doc}
                pageNumber={selectedIndex + 1}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <ConfirmDialog
      heading="Start over?"
      body="All members, photos and field changes will be cleared."
      confirmLabel="Clear everything"
      onConfirm={onReset}
    >
      <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
        <RotateCcw className="size-4" />
        Start over
      </Button>
    </ConfirmDialog>
  );
}
