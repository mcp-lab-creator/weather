import PageTitle from "@/components/PageTitle";
import { formatDate, pick } from "@/lib/i18n";
import { getT } from "@/lib/lang";
import { db, type Notice } from "@/lib/supabase";

export default async function NoticesPage() {
  const { lang, t } = await getT();
  const { data, error } = await db()
    .from("notices")
    .select("*")
    .order("notice_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const notices = (data ?? []) as Notice[];

  return (
    <>
      <PageTitle icon="📢" title={t.noticesTitle} />
      {notices.length === 0 && <p className="rounded-xl bg-white p-4 shadow">{t.noNotices}</p>}
      <div className="space-y-4">
        {notices.map((n) => {
          const meeting = n.type === "gram_sabha";
          return (
            <article
              key={n.id}
              className={`rounded-2xl bg-white p-5 shadow ${meeting ? "border-l-8 border-amber-500" : "border-l-8 border-emerald-600"}`}
            >
              <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
                <span className={`rounded-full px-3 py-1 ${meeting ? "bg-amber-100 text-amber-900" : "bg-emerald-100 text-emerald-900"}`}>
                  {meeting ? "🏛️" : "📢"} {t.typeLabels[n.type]}
                </span>
                <span className="text-stone-500">📅 {formatDate(lang, n.notice_date)}</span>
              </div>
              <h2 className="mt-2 text-xl font-extrabold">{pick(lang, n.title_hi, n.title_en)}</h2>
              <p className="mt-1 whitespace-pre-line text-lg">{pick(lang, n.body_hi, n.body_en)}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
