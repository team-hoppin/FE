import * as React from "react";
import { cn } from "@/lib/utils";

interface Props extends React.ComponentProps<"textarea"> {
  label?: string;
  maxLength: number;
}

export function Textarea({ label, className, maxLength, ...props }: Props) {
  return (
    <div
      className={cn(
        "flex h-33 w-full flex-col gap-1 rounded-lg border px-4 py-2",
        "border-border bg-grey1",
        className
      )}
    >
      <label className="c1-medium text-font-middle">{label}</label>

      <textarea
        className={cn(
          "flex-1 resize-none bg-transparent p-0 caret-current outline-none",
          "p2-regular text-font-basic",
          "placeholder:text-font-light"
        )}
        maxLength={maxLength}
        {...props}
      />

      <div className="flex justify-end">
        <span className="c1-medium text-font-light">0 / {maxLength}</span>
      </div>
    </div>
  );
}
