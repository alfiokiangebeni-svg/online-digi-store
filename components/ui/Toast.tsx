import type { ReactNode } from "react";
import { cn } from "./cn";
import { IconCheck, IconClose } from "./icons";

/** Notification courte. Rendue dans une région aria-live par le parent. */
export function Toast({
  tone = "success",
  children,
  closeLabel,
  onClose,
}: {
  tone?: "success" | "error";
  children: ReactNode;
  closeLabel?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex w-full max-w-sm animate-toast-in items-start gap-3 border-l-4 bg-surface-2 p-4 text-sm text-fg shadow-[0_8px_0_-4px_rgb(0_0_0/0.25)]",
        tone === "success" ? "border-fleuve" : "border-laterite",
      )}
    >
      <span className={cn("mt-0.5 shrink-0", tone === "success" ? "text-success" : "text-laterite")}>
        {tone === "success" ? <IconCheck size={18} /> : <IconClose size={18} />}
      </span>
      <p className="flex-1">{children}</p>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="-m-3 grid size-11 shrink-0 place-items-center text-muted hover:text-fg"
        >
          <IconClose size={16} />
        </button>
      ) : null}
    </div>
  );
}
