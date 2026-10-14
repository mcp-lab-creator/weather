import PageTitle from "@/components/PageTitle";
import { pick } from "@/lib/i18n";
import { getT } from "@/lib/lang";
import { db, type Scheme } from "@/lib/supabase";

export default async function SchemesPage() {
  const { lang, t } = await getT();
  const { data, error } = await db()
    .from("schemes")
    .select("*")
    .order("sort_order")
    .order("created_at");
  if (error) throw error;
  const schemes = (data ?? []) as Scheme[];

  const sections = (s: Scheme) => [
    { icon: "🎁", label: t.benefit, text: pick(lang, s.benefit_hi, s.benefit_en) },
    { icon: "👨‍👩‍👧", label: t.eligibility, text: pick(lang, s.eligibility_hi, s.eligibility_en) },
    { icon: "📄", label: t.documents, text: pick(lang, s.documents_hi, s.documents_en) },
  ];

  return (
    <>
      <PageTitle icon="🏛️" title={t.schemesTitle} />
      {schemes.length === 0 && <p className="rounded-xl bg-white p-4 shadow">{t.noSchemes}</p>}
      <div className="space-y-4">
        {schemes.map((s) => (
          <article key={s.id} className="rounded-2xl bg-white p-5 shadow">
            <h2 className="text-xl font-extrabold text-emerald-800">{pick(lang, s.name_hi, s.name_en)}</h2>
            <div className="mt-3 space-y-3">
              {sections(s).map((sec) => (
                <div key={sec.label}>
                  <p className="text-base font-bold text-stone-600">
                    {sec.icon} {sec.label}
                  </p>
                  <p className="whitespace-pre-line text-lg">{sec.text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
      {schemes.length > 0 && (
        <p className="mt-5 rounded-xl bg-emerald-100 p-4 text-base font-semibold text-emerald-900">
          ℹ️ {t.schemeNote}
        </p>
      )}
    </>
  );
}
