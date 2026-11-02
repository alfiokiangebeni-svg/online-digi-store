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
        "flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-[10px] bg-ink p-4 text-sm text-white shadow-[0_8px_24px_rgb(0_0_0/0.18)]",
        tone === "success" ? "" : "",
      )}
    >
      <span className={cn("mt-0.5 shrink-0", tone === "success" ? "text-lime-strong" : "text-[#ff8a80]")}>
        {tone === "success" ? <IconCheck size={18} /> : <IconClose size={18} />}
      </span>
      <p className="flex-1">{children}</p>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="-m-3 grid size-11 shrink-0 place-items-center text-steel hover:text-white"
        >
          <IconClose size={16} />
        </button>
      ) : null}
    </div>
  );
}
