"use client";

import { useState } from "react";
import { detectOperator, toNationalDigits } from "@/lib/operators";
import { format } from "@/lib/i18n/format";
import { Field } from "./Field";

const OPERATOR_DOT: Record<string, string> = {
  mpesa: "bg-[#E60000]",
  orange: "bg-[#FF7900]",
  airtel: "bg-[#ED1C24]",
  afrimoney: "bg-[#5B2C83]",
};

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
          <span className="flex items-center gap-1.5 text-xs font-medium">
            <span aria-hidden="true" className={`size-2.5 rounded-full ${OPERATOR_DOT[operator.id]}`} />
            {operator.name.split(" ").at(-1)}
          </span>
        ) : null
      }
    />
  );
}
