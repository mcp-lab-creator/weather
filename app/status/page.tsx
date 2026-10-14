import PageTitle from "@/components/PageTitle";
import { db } from "@/lib/supabase";
import { CATEGORY_ICONS, formatDate, STATUS_ICONS, type Category, type Status } from "@/lib/i18n";
import { getT } from "@/lib/lang";

type Row = {
  tracking_id: string;
  ward: number;
  category: Category;
  description: string;
  status: Status;
  remarks: string | null;
  created_at: string;
};

const statusColor: Record<Status, string> = {
  submitted: "bg-amber-100 text-amber-900",
  in_progress: "bg-blue-100 text-blue-900",
  resolved: "bg-emerald-100 text-emerald-900",
};

export default async function StatusPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { lang, t } = await getT();
  const q = ((await searchParams).q ?? "").trim();

  let rows: Row[] = [];
  let invalid = false;

  if (q) {
    // Only non-personal columns are selected – name and mobile are never sent to the browser.
    const columns = "tracking_id, ward, category, description, status, remarks, created_at";
    const idMatch = q.toUpperCase().match(/^PCH-?(\d{1,9})$/);
    const mobile = q.replace(/[\s-]/g, "");
    if (idMatch) {
      const id = `PCH-${idMatch[1].padStart(4, "0")}`;
      const { data, error } = await db().from("complaints").select(columns).eq("tracking_id", id);
      if (error) throw error;
      rows = (data ?? []) as Row[];
    } else if (/^[6-9][0-9]{9}$/.test(mobile)) {
      const { data, error } = await db()
        .from("complaints")
        .select(columns)
        .eq("mobile", mobile)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      rows = (data ?? []) as Row[];
    } else {
      invalid = true;
    }
  }

  return (
    <>
      <PageTitle icon="🔍" title={t.statusTitle} />

      <form action="/status" className="space-y-3">
        <label htmlFor="q" className="block text-lg font-bold">
          {t.statusHelp}
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          required
          autoComplete="off"
          placeholder={t.statusPh}
          className="min-h-14 w-full rounded-xl border-2 border-stone-300 bg-white px-4 text-lg"
        />
        <button
          type="submit"
          className="min-h-14 w-full rounded-xl bg-blue-600 text-xl font-extrabold text-white active:bg-blue-700"
        >
          🔍 {t.search}
        </button>
      </form>

      <div className="mt-6 space-y-4">
        {invalid && (
          <p className="rounded-xl bg-red-100 p-4 text-lg font-bold text-red-800">⚠️ {t.invalidQuery}</p>
        )}
        {q && !invalid && rows.length === 0 && (
          <p className="rounded-xl bg-white p-4 text-lg shadow">😕 {t.notFound}</p>
        )}
        {rows.map((c) => (
          <article key={c.tracking_id} className="rounded-2xl bg-white p-5 shadow">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-2xl font-extrabold">{c.tracking_id}</h2>
              <span className={`rounded-full px-3 py-1 text-base font-bold ${statusColor[c.status]}`}>
                {STATUS_ICONS[c.status]} {t.statusLabels[c.status]}
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold">
              {CATEGORY_ICONS[c.category]} {t.categoryLabels[c.category]} · {t.wardN} {c.ward}
            </p>
            <p className="mt-1 text-stone-700">
              {c.description.length > 80 ? `${c.description.slice(0, 80)}…` : c.description}
            </p>
            <p className="mt-1 text-sm text-stone-500">
              {t.submittedOn}: {formatDate(lang, c.created_at)}
            </p>
            <div className="mt-3 rounded-xl bg-stone-50 p-3">
              <p className="text-sm font-bold text-stone-600">💬 {t.remarks}</p>
              <p className="text-lg">{c.remarks || t.noRemarks}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
