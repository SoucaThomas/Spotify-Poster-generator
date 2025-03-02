"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ColorPicker({
  label,
  value,
  onChange,
  disabled = false,
}: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={label}>{label}</Label>
        <div
          className="h-5 w-5 rounded-full border"
          style={{ backgroundColor: value }}
        />
      </div>
      <Input
        id={label}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-10"
      />
    </div>
  );
}
