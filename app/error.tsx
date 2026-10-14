"use client";

import { dict, LANG_COOKIE } from "@/lib/i18n";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const lang =
    typeof document !== "undefined" && document.cookie.includes(`${LANG_COOKIE}=en`) ? "en" : "hi";
  const t = dict[lang];
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow">
      <p className="text-4xl">⚠️</p>
      <h1 className="mt-2 text-2xl font-extrabold">{t.errorTitle}</h1>
      <p className="mt-1">{t.errorBody}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-xl bg-emerald-700 px-6 py-3 text-lg font-bold text-white"
      >
        {t.retry}
      </button>
    </div>
  );
}
