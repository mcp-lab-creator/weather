import { redirect } from "next/navigation";
import { deleteScheme, saveScheme } from "../actions";
import SubmitButton from "@/components/SubmitButton";
import { isAdmin } from "@/lib/admin-auth";
import { db, type Scheme } from "@/lib/supabase";

const input = "w-full rounded-lg border-2 border-stone-300 bg-white p-2";

function Field({ label, name, value, required, rows = 2 }: { label: string; name: string; value?: string | null; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}{required && " *"}</span>
      <textarea name={name} defaultValue={value ?? ""} required={required} rows={rows} className={input} />
    </label>
  );
}

function SchemeForm({ s }: { s?: Scheme }) {
  return (
    <form action={saveScheme} className="space-y-2">
      {s && <input type="hidden" name="id" value={s.id} />}
      <label className="block">
        <span className="text-sm font-bold">Order (small number shows first)</span>
        <input name="sort_order" type="number" defaultValue={s?.sort_order ?? 0} className={input} />
      </label>
      <Field label="Name (Hindi)" name="name_hi" value={s?.name_hi} required rows={1} />
      <Field label="Name (English)" name="name_en" value={s?.name_en} rows={1} />
      <Field label="Benefit (Hindi)" name="benefit_hi" value={s?.benefit_hi} required />
      <Field label="Benefit (English)" name="benefit_en" value={s?.benefit_en} />
      <Field label="Who is eligible (Hindi)" name="eligibility_hi" value={s?.eligibility_hi} required />
      <Field label="Who is eligible (English)" name="eligibility_en" value={s?.eligibility_en} />
      <Field label="Documents needed (Hindi)" name="documents_hi" value={s?.documents_hi} required />
      <Field label="Documents needed (English)" name="documents_en" value={s?.documents_en} />
      <SubmitButton>{s ? "Save changes" : "Add scheme"}</SubmitButton>
    </form>
  );
}

export default async function AdminSchemes() {
  if (!(await isAdmin())) redirect("/admin");
  const { data, error } = await db().from("schemes").select("*").order("sort_order").order("created_at");
  if (error) throw error;
  const schemes = (data ?? []) as Scheme[];

  return (
    <>
      <h1 className="mb-3 text-2xl font-extrabold">🏛️ Schemes</h1>
      <p className="mb-3 text-sm text-stone-600">Hindi is required. If English is empty, Hindi is shown to English users.</p>

      <details className="mb-4 rounded-2xl bg-white p-4 shadow">
        <summary className="cursor-pointer text-lg font-bold">➕ Add new scheme</summary>
        <div className="mt-3"><SchemeForm /></div>
      </details>

      <div className="space-y-3">
        {schemes.map((s) => (
          <details key={s.id} className="rounded-2xl bg-white p-4 shadow">
            <summary className="cursor-pointer text-lg font-bold">{s.name_hi}</summary>
            <div className="mt-3 space-y-3">
              <SchemeForm s={s} />
              <form action={deleteScheme}>
                <input type="hidden" name="id" value={s.id} />
                <SubmitButton className="bg-red-700!">Delete</SubmitButton>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
