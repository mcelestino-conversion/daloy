"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

export function Dialog({ open, onClose, title, description, children }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      className="m-auto max-h-[88vh] w-[min(680px,calc(100vw-32px))] rounded-2xl border border-border bg-elevated p-0 text-ivory shadow-2xl backdrop:bg-black/70"
    >
      <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
          {description ? <p className="mt-1 text-sm leading-6 text-taupe">{description}</p> : null}
        </div>
        <button className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg text-taupe transition hover:bg-surface hover:text-ivory focus-visible:outline-2 focus-visible:outline-sandstone" onClick={onClose} aria-label="Close dialog">
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
