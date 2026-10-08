"use client";

import { useEffect, useRef, useState } from "react";
import { getTemplate } from "@/templates";
import { htmlKit } from "@/templates/html-kit";
import { PAGE_HEIGHT, PAGE_WIDTH } from "@/templates/kit";
import type { DocSettings, Field, Member } from "@/lib/types";

interface ScaledPageProps {
  member: Member;
  fields: Field[];
  doc: DocSettings;
  pageNumber: number;
  /** Fixed render width in px; omit to fill the parent's width. */
  width?: number;
  className?: string;
}

/** Renders a template at true A4 size and scales it to the available width. */
export function ScaledPage({
  member,
  fields,
  doc,
  pageNumber,
  width,
  className,
}: ScaledPageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(0);

  useEffect(() => {
    if (width || !ref.current) return;
    const el = ref.current;
    const observer = new ResizeObserver(([entry]) =>
      setMeasured(entry.contentRect.width),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  const w = width ?? measured;
  const scale = w / PAGE_WIDTH;
  const { Component } = getTemplate(doc.templateId);

  return (
    <div
      ref={ref}
      className={className}
      style={{ width: width ?? "100%", height: PAGE_HEIGHT * scale }}
    >
      {w > 0 && (
        <div
          aria-hidden
          style={{
            width: PAGE_WIDTH,
            height: PAGE_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <Component
            kit={htmlKit}
            member={member}
            fields={fields}
            doc={doc}
            pageNumber={pageNumber}
          />
        </div>
      )}
    </div>
  );
}
