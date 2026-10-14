"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-xl bg-emerald-700 px-5 py-3 text-lg font-bold text-white disabled:opacity-60 active:bg-emerald-800 ${className}`}
    >
      {pending ? "…" : children}
    </button>
  );
}
