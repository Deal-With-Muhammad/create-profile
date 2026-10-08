"use client";

import { Button, toast } from "@heroui/react";
import { ImagePlus, Trash2, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { photoToDataUrl } from "@/lib/image";

interface PhotoPickerProps {
  photo?: string;
  onChange: (photo: string | undefined) => void;
}

export function PhotoPicker({ photo, onChange }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await photoToDataUrl(file));
    } catch (error) {
      toast.danger("Couldn't use that photo", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFile(e.dataTransfer.files[0]);
      }}
      className={`flex items-center gap-5 rounded-2xl border border-dashed p-4 transition-colors ${
        dragging
          ? "border-accent bg-accent/5"
          : "border-neutral-300 bg-white"
      }`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        aria-label={photo ? "Change photo" : "Upload photo"}
        className="group relative size-24 shrink-0 cursor-pointer overflow-hidden rounded-full bg-neutral-100 outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-accent"
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element -- local data URL
          <img src={photo} alt="" className="size-full object-cover" />
        ) : (
          <UserRound className="absolute inset-0 m-auto size-10 text-neutral-400" />
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ImagePlus className="size-6" />
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-neutral-900">Photo</p>
        <p className="mt-0.5 text-sm text-neutral-500" aria-live="polite">
          {busy
            ? "Preparing photo… HEIC photos can take a few seconds."
            : "JPG, PNG or HEIC. Drop an image here or upload."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            isPending={busy}
            onPress={() => inputRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            {photo ? "Change photo" : "Upload photo"}
          </Button>
          {photo && (
            <Button
              size="sm"
              variant="ghost"
              onPress={() => onChange(undefined)}
            >
              <Trash2 className="size-4" />
              Remove
            </Button>
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
