"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES, CATEGORY_ICONS, dict, type Lang } from "@/lib/i18n";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

/** Shrink phone photos (often 3–8 MB) so uploads are quick on slow networks. */
async function shrinkPhoto(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.7),
    );
    if (blob) return blob;
  } catch {
    // fall through and send the original
  }
  return file;
}

const chip =
  "flex min-h-14 cursor-pointer items-center justify-center rounded-xl border-2 border-stone-300 bg-white text-center font-bold has-[:checked]:border-emerald-700 has-[:checked]:bg-emerald-700 has-[:checked]:text-white";

export default function ComplaintForm({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [copied, setCopied] = useState(false);
  const [photoName, setPhotoName] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);

    const mobile = String(data.get("mobile") ?? "").trim();
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
      setError(t.errMobile);
      return;
    }

    setSending(true);
    try {
      const photo = data.get("photo");
      data.delete("photo");
      if (photo instanceof File && photo.size > 0) {
        const small = await shrinkPhoto(photo);
        if (small.size > MAX_PHOTO_BYTES) {
          setError(t.errPhoto);
          setSending(false);
          return;
        }
        data.set("photo", small, "photo.jpg");
      }

      const res = await fetch("/api/complaints", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.trackingId) {
        setError(json.error === "mobile" ? t.errMobile : t.errGeneric);
      } else {
        setTrackingId(json.trackingId);
      }
    } catch {
      setError(t.errGeneric);
    }
    setSending(false);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopied(true);
    } catch {
      // clipboard may be unavailable; the ID is on screen anyway
    }
  }

  if (trackingId) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow">
        <p className="text-5xl">✅</p>
        <h2 className="mt-2 text-2xl font-extrabold text-emerald-800">{t.done}</h2>
        <p className="mt-4 text-lg">{t.yourId}</p>
        <p className="my-2 select-all rounded-xl bg-emerald-50 py-4 text-5xl font-extrabold tracking-wider text-emerald-900">
          {trackingId}
        </p>
        <p className="text-base text-stone-600">{t.saveId}</p>
        <button
          onClick={copy}
          className="mt-4 min-h-14 w-full rounded-xl border-2 border-emerald-700 text-lg font-bold text-emerald-800"
        >
          📋 {copied ? t.copied : t.copy}
        </button>
        <Link
          href={`/status?q=${trackingId}`}
          className="mt-3 flex min-h-14 w-full items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white"
        >
          🔍 {t.checkThis}
        </Link>
        <button
          onClick={() => {
            setTrackingId("");
            setCopied(false);
            setPhotoName("");
          }}
          className="mt-3 min-h-14 w-full rounded-xl text-lg font-bold text-stone-700 underline"
        >
          {t.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="mb-1 block text-lg font-bold">👤 {t.name}</span>
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          placeholder={t.namePh}
          className="min-h-14 w-full rounded-xl border-2 border-stone-300 bg-white px-4 text-lg"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-lg font-bold">📱 {t.mobile}</span>
        <input
          name="mobile"
          required
          type="tel"
          inputMode="numeric"
          maxLength={10}
          autoComplete="tel-national"
          placeholder={t.mobilePh}
          className="min-h-14 w-full rounded-xl border-2 border-stone-300 bg-white px-4 text-lg"
        />
      </label>

      <fieldset>
        <legend className="mb-2 text-lg font-bold">🏘️ {t.ward}</legend>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <label key={n} className={chip}>
              <input type="radio" name="ward" value={n} required className="sr-only" />
              {n}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-lg font-bold">📂 {t.category}</legend>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <label key={c} className={`${chip} flex-col gap-1 px-1 py-2 text-sm`}>
              <input type="radio" name="category" value={c} required className="sr-only" />
              <span aria-hidden className="text-3xl">{CATEGORY_ICONS[c]}</span>
              {t.categoryLabels[c]}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="block">
        <span className="mb-1 block text-lg font-bold">✍️ {t.description}</span>
        <textarea
          name="description"
          required
          rows={4}
          maxLength={1000}
          placeholder={t.descriptionPh}
          className="w-full rounded-xl border-2 border-stone-300 bg-white p-4 text-lg"
        />
      </label>

      <div>
        <span className="mb-1 block text-lg font-bold">📷 {t.photo}</span>
        <label className="flex min-h-14 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-stone-400 bg-white px-3 text-center text-lg font-bold">
          {photoName ? `✔ ${t.photoChosen}` : t.photoBtn}
          <input
            type="file"
            name="photo"
            accept="image/*"
            className="sr-only"
            onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? "")}
          />
        </label>
        {photoName && <p className="mt-1 truncate text-sm text-stone-600">{photoName}</p>}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-red-100 p-4 text-lg font-bold text-red-800">
          ⚠️ {error}
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="min-h-16 w-full rounded-2xl bg-red-600 text-xl font-extrabold text-white disabled:opacity-60 active:bg-red-700"
      >
        {sending ? t.sending : `📨 ${t.submit}`}
      </button>
    </form>
  );
}
