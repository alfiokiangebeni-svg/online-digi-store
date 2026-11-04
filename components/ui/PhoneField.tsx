"use client";

import { useState } from "react";
import { detectOperator, toNationalDigits } from "@/lib/operators";
import { format } from "@/lib/i18n/format";
import { Field } from "./Field";
import { IconPhone } from "./icons";

/** Champ numéro Mobile Money avec détection de l'opérateur pendant la saisie. */
export function PhoneField({
  id,
  name = "phone",
  label,
  placeholder,
  hint,
  detectedTemplate,
  unknownText,
  onValueChange,
  error,
}: {
  id: string;
  name?: string;
  label: string;
  placeholder: string;
  hint: string;
  detectedTemplate: string;
  unknownText: string;
  onValueChange?: (value: string) => void;
  error?: string;
}) {
  const [value, setValue] = useState("");
  const operator = detectOperator(value);
  const typedPrefix = toNationalDigits(value).length >= 2;

  let message = hint;
  if (operator) message = format(detectedTemplate, { operator: operator.name });
  else if (typedPrefix) message = unknownText;

  return (
    <Field
      id={id}
      name={name}
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onValueChange?.(e.target.value);
      }}
      error={error}
      mono
      hint={message}
      adornment={
        operator ? (
          <span className="badge bg-line text-fg">
            <IconPhone size={12} />
            {operator.name.split(" ").at(-1)}
          </span>
        ) : null
      }
    />
  );
}
