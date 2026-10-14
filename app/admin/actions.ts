"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_COOKIE, checkPassword, requireAdmin, sessionToken } from "@/lib/admin-auth";
import { STATUSES } from "@/lib/i18n";
import { db } from "@/lib/supabase";

const str = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const opt = (form: FormData, key: string) => str(form, key) || null;

export async function login(form: FormData) {
  if (!checkPassword(String(form.get("password") ?? ""))) redirect("/admin?error=1");
  (await cookies()).set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function updateComplaint(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status");
  if (!id || !(STATUSES as readonly string[]).includes(status)) return;
  const { error } = await db()
    .from("complaints")
    .update({ status, remarks: opt(form, "remarks"), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin");
}

export async function saveScheme(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  const row = {
    sort_order: Number(str(form, "sort_order")) || 0,
    name_hi: str(form, "name_hi"),
    name_en: opt(form, "name_en"),
    benefit_hi: str(form, "benefit_hi"),
    benefit_en: opt(form, "benefit_en"),
    eligibility_hi: str(form, "eligibility_hi"),
    eligibility_en: opt(form, "eligibility_en"),
    documents_hi: str(form, "documents_hi"),
    documents_en: opt(form, "documents_en"),
  };
  if (!row.name_hi || !row.benefit_hi || !row.eligibility_hi || !row.documents_hi) return;
  const q = id ? db().from("schemes").update(row).eq("id", id) : db().from("schemes").insert(row);
  const { error } = await q;
  if (error) throw error;
  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
}

export async function deleteScheme(form: FormData) {
  await requireAdmin();
  const { error } = await db().from("schemes").delete().eq("id", str(form, "id"));
  if (error) throw error;
  revalidatePath("/admin/schemes");
  revalidatePath("/schemes");
}

export async function saveNotice(form: FormData) {
  await requireAdmin();
  const id = str(form, "id");
  const type = str(form, "type") === "gram_sabha" ? "gram_sabha" : "notice";
  const row = {
    type,
    title_hi: str(form, "title_hi"),
    title_en: opt(form, "title_en"),
    body_hi: str(form, "body_hi"),
    body_en: opt(form, "body_en"),
    notice_date: str(form, "notice_date") || new Date().toISOString().slice(0, 10),
  };
  if (!row.title_hi || !row.body_hi) return;
  const q = id ? db().from("notices").update(row).eq("id", id) : db().from("notices").insert(row);
  const { error } = await q;
  if (error) throw error;
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}

export async function deleteNotice(form: FormData) {
  await requireAdmin();
  const { error } = await db().from("notices").delete().eq("id", str(form, "id"));
  if (error) throw error;
  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}
