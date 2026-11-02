"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Segmented } from "@/components/ui/Segmented";
import { Switch } from "@/components/ui/Switch";
import { Stamp } from "@/components/ui/Stamp";
import { Toast } from "@/components/ui/Toast";

/** Démonstrations interactives de la page /design (uniquement ici). */

export function ToastDemo({
  trigger,
  success,
  error,
  closeLabel,
}: {
  trigger: string;
  success: string;
  error: string;
  closeLabel: string;
}) {
  const [toasts, setToasts] = useState<{ id: number; tone: "success" | "error" }[]>([]);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button
        variant="secondary"
        onClick={() =>
          setToasts((t) => [...t.slice(-2), { id: Date.now(), tone: t.length % 2 ? "error" : "success" }])
        }
      >
        {trigger}
      </Button>
      <div role="status" aria-live="polite" className="flex w-full flex-col gap-2">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            tone={t.tone}
            closeLabel={closeLabel}
            onClose={() => setToasts((all) => all.filter((x) => x.id !== t.id))}
          >
            {t.tone === "success" ? success : error}
          </Toast>
        ))}
      </div>
    </div>
  );
}

export function StampDemo({ label, replay }: { label: string; replay: string }) {
  const [n, setN] = useState(0);
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="grid h-24 w-56 place-items-center bg-surface ticket">
        <Stamp key={n} label={label} />
      </div>
      <Button variant="ghost" onClick={() => setN((x) => x + 1)}>
        {replay}
      </Button>
    </div>
  );
}

export function ChipDemo({ labels }: { labels: string[] }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l, i) => (
        <Chip key={l} selected={i === selected} onClick={() => setSelected(i)}>
          {l}
        </Chip>
      ))}
    </div>
  );
}

export function SegmentedDemo({ label, options }: { label: string; options: string[] }) {
  const [value, setValue] = useState(options[0]);
  return (
    <Segmented
      label={label}
      value={value}
      options={options.map((o) => ({ value: o, label: o }))}
      onChange={setValue}
    />
  );
}

export function SwitchDemo({ label }: { label: string }) {
  const [on, setOn] = useState(true);
  return (
    <span className="inline-flex items-center gap-2">
      <span id="switch-demo-label" className="text-sm font-medium">
        {label}
      </span>
      <Switch checked={on} onChange={setOn} labelledBy="switch-demo-label" />
    </span>
  );
}
