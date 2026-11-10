"use client";

import { Button } from "@/components/ui/Button";
import { IconLink } from "@/components/ui/icons";
import { toast } from "@/lib/client/toast";

export function CopyTextButton({
  text,
  label,
  done,
  failed,
}: {
  text: string;
  label: string;
  done: string;
  failed: string;
}) {
  return (
    <Button
      variant="outline"
      block
      icon={<IconLink size={18} />}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          toast({ tone: "success", message: done });
        } catch {
          toast({ tone: "error", message: failed });
        }
      }}
    >
      {label}
    </Button>
  );
}
