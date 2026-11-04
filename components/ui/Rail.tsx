import type { ReactNode } from "react";

/** Rayon horizontal défilant (Tendance à Kinshasa, Moins de 5 $…). */
export function Rail({
  id,
  title,
  action,
  children,
}: {
  id: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-4">
      <div className="mb-2.5 flex items-center justify-between gap-4">
        <h2 id={id} className="text-base font-bold">
          {title}
        </h2>
        {action}
      </div>
      <div className="scroll-rail -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1">{children}</div>
    </section>
  );
}
