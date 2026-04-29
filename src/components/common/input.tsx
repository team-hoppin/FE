import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"input"> {
  label?: string;
  iconBtn?: React.ReactNode;
}

export function Input({ label, className, iconBtn, ...props }: Props) {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col gap-1 rounded-lg border px-4 py-2",
        "border-border bg-grey1",
        className
      )}
    >
      {label && <label className="c1-medium text-font-middle">{label}</label>}

      <input
        className={cn(
          "flex-1 bg-transparent p-0 caret-current outline-none",
          "p2-regular text-font-basic",
          "placeholder:text-font-light",
          iconBtn && "pr-6"
        )}
        {...props}
      />

      {iconBtn && (
        <div className="text-font-light absolute top-1/2 right-4 -translate-y-1/2">
          {iconBtn}
        </div>
      )}
    </div>
  );
}
