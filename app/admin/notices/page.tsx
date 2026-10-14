import { redirect } from "next/navigation";
import { deleteNotice, saveNotice } from "../actions";
import SubmitButton from "@/components/SubmitButton";
import { isAdmin } from "@/lib/admin-auth";
import { db, type Notice } from "@/lib/supabase";

const input = "w-full rounded-lg border-2 border-stone-300 bg-white p-2";

function Field({ label, name, value, required, rows = 2 }: { label: string; name: string; value?: string | null; required?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="text-sm font-bold">{label}{required && " *"}</span>
      <textarea name={name} defaultValue={value ?? ""} required={required} rows={rows} className={input} />
    </label>
  );
}

function NoticeForm({ n }: { n?: Notice }) {
  return (
    <form action={saveNotice} className="space-y-2">
      {n && <input type="hidden" name="id" value={n.id} />}
      <label className="block">
        <span className="text-sm font-bold">Type</span>
        <select name="type" defaultValue={n?.type ?? "notice"} className={input}>
          <option value="notice">Notice / सूचना</option>
          <option value="gram_sabha">Gram Sabha meeting / ग्राम सभा बैठक</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-bold">Date (for a Gram Sabha, use the meeting date)</span>
        <input
          name="notice_date"
          type="date"
          required
          defaultValue={n?.notice_date ?? new Date().toISOString().slice(0, 10)}
          className={input}
        />
      </label>
      <Field label="Title (Hindi)" name="title_hi" value={n?.title_hi} required rows={1} />
      <Field label="Title (English)" name="title_en" value={n?.title_en} rows={1} />
      <Field label="Details (Hindi)" name="body_hi" value={n?.body_hi} required rows={4} />
      <Field label="Details (English)" name="body_en" value={n?.body_en} rows={4} />
      <SubmitButton>{n ? "Save changes" : "Add notice"}</SubmitButton>
    </form>
  );
}

export default async function AdminNotices() {
  if (!(await isAdmin())) redirect("/admin");
  const { data, error } = await db()
    .from("notices")
    .select("*")
    .order("notice_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  const notices = (data ?? []) as Notice[];

  return (
    <>
      <h1 className="mb-3 text-2xl font-extrabold">📢 Notices</h1>
      <p className="mb-3 text-sm text-stone-600">Hindi is required. If English is empty, Hindi is shown to English users.</p>

      <details className="mb-4 rounded-2xl bg-white p-4 shadow">
        <summary className="cursor-pointer text-lg font-bold">➕ Add new notice</summary>
        <div className="mt-3"><NoticeForm /></div>
      </details>

      <div className="space-y-3">
        {notices.map((n) => (
          <details key={n.id} className="rounded-2xl bg-white p-4 shadow">
            <summary className="cursor-pointer text-lg font-bold">
              {n.notice_date} · {n.title_hi}
            </summary>
            <div className="mt-3 space-y-3">
              <NoticeForm n={n} />
              <form action={deleteNotice}>
                <input type="hidden" name="id" value={n.id} />
                <SubmitButton className="bg-red-700!">Delete</SubmitButton>
              </form>
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
