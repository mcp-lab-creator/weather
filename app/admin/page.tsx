import { login, updateComplaint } from "./actions";
import SubmitButton from "@/components/SubmitButton";
import { isAdmin } from "@/lib/admin-auth";
import { CATEGORIES, CATEGORY_ICONS, dict, STATUSES } from "@/lib/i18n";
import { db, type Complaint } from "@/lib/supabase";

const en = dict.en;
const hi = dict.hi;
const select = "min-h-12 w-full rounded-lg border-2 border-stone-300 bg-white px-3";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; ward?: string; category?: string; error?: string }>;
}) {
  const sp = await searchParams;

  if (!(await isAdmin())) {
    return (
      <form action={login} className="space-y-4 rounded-2xl bg-white p-6 shadow">
        <h1 className="text-2xl font-extrabold">🔐 Admin login</h1>
        {sp.error && <p className="font-bold text-red-700">Wrong password.</p>}
        {!process.env.ADMIN_PASSWORD && (
          <p className="font-bold text-red-700">ADMIN_PASSWORD is not set on the server.</p>
        )}
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="Password"
          className="min-h-14 w-full rounded-xl border-2 border-stone-300 px-4 text-lg"
        />
        <SubmitButton className="w-full">Login</SubmitButton>
      </form>
    );
  }

  let query = db().from("complaints").select("*").order("created_at", { ascending: false }).limit(200);
  if (sp.status && (STATUSES as readonly string[]).includes(sp.status)) query = query.eq("status", sp.status);
  if (sp.ward && /^([1-9]|10)$/.test(sp.ward)) query = query.eq("ward", Number(sp.ward));
  if (sp.category && (CATEGORIES as readonly string[]).includes(sp.category))
    query = query.eq("category", sp.category);
  const { data, error } = await query;
  if (error) throw error;
  const complaints = (data ?? []) as Complaint[];

  return (
    <>
      <h1 className="mb-3 text-2xl font-extrabold">📋 Complaints ({complaints.length})</h1>

      <form className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 shadow sm:grid-cols-4">
        <select name="status" defaultValue={sp.status ?? ""} className={select}>
          <option value="">All status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{en.statusLabels[s]}</option>
          ))}
        </select>
        <select name="ward" defaultValue={sp.ward ?? ""} className={select}>
          <option value="">All wards</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>Ward {n}</option>
          ))}
        </select>
        <select name="category" defaultValue={sp.category ?? ""} className={select}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{en.categoryLabels[c]} / {hi.categoryLabels[c]}</option>
          ))}
        </select>
        <SubmitButton>Filter</SubmitButton>
      </form>

      <div className="space-y-4">
        {complaints.length === 0 && <p className="rounded-xl bg-white p-4 shadow">No complaints.</p>}
        {complaints.map((c) => (
          <article key={c.id} className="rounded-2xl bg-white p-5 shadow">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-extrabold">{c.tracking_id}</h2>
              <span className="text-sm text-stone-500">
                {new Date(c.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
              </span>
            </div>
            <p className="mt-1 font-semibold">
              {CATEGORY_ICONS[c.category as keyof typeof CATEGORY_ICONS]}{" "}
              {en.categoryLabels[c.category as keyof typeof en.categoryLabels]} · Ward {c.ward}
            </p>
            <p className="mt-1">
              {c.name} ·{" "}
              <a href={`tel:${c.mobile}`} className="font-bold text-blue-700 underline">
                {c.mobile}
              </a>
            </p>
            <p className="mt-2 whitespace-pre-line rounded-lg bg-stone-50 p-3">{c.description}</p>
            {c.photo_url && (
              <a href={c.photo_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.photo_url} alt="Complaint photo" loading="lazy" className="max-h-48 rounded-lg" />
              </a>
            )}
            <form action={updateComplaint} className="mt-3 space-y-2">
              <input type="hidden" name="id" value={c.id} />
              <select name="status" defaultValue={c.status} className={select}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{en.statusLabels[s]}</option>
                ))}
              </select>
              <textarea
                name="remarks"
                defaultValue={c.remarks ?? ""}
                rows={2}
                placeholder="Remarks for the citizen (Hindi or English)"
                className="w-full rounded-lg border-2 border-stone-300 p-3"
              />
              <SubmitButton>Save</SubmitButton>
            </form>
          </article>
        ))}
      </div>
    </>
  );
}
