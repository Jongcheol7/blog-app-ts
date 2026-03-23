"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

type Props = {
  label: string;
  id: string;
  isDisabled: boolean;
  defaultVal: boolean;
  onChange?: (val: boolean) => void;
};

export default function LabelCheckbox({
  label,
  id,
  isDisabled,
  defaultVal,
  onChange,
}: Props) {
  const [checked, setChecked] = useState(defaultVal);

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="text-sm font-medium text-muted-foreground cursor-pointer select-none"
      >
        {label}
      </label>
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        id={id}
        disabled={isDisabled}
        onClick={() => {
          if (isDisabled) return;
          const next = !checked;
          setChecked(next);
          onChange?.(next);
        }}
        className={cn(
          "h-5 w-9 rounded-full transition-colors duration-200 relative cursor-pointer",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          checked ? "bg-primary" : "bg-input"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked && "translate-x-4"
          )}
        />
      </button>
    </div>
  );
}
