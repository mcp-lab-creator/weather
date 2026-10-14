"use client";

import { useRouter } from "next/navigation";
import { LANG_COOKIE, type Lang } from "@/lib/i18n";

export default function LangToggle({ lang, label }: { lang: Lang; label: string }) {
  const router = useRouter();

  function toggle() {
    const next = lang === "hi" ? "en" : "hi";
    document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-full bg-white px-4 py-2 text-base font-bold text-emerald-800 active:bg-emerald-100"
    >
      🌐 {label}
    </button>
  );
}
