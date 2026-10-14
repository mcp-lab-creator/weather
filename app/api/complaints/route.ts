import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/i18n";
import { db, PHOTO_BUCKET } from "@/lib/supabase";

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function bad(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("invalid");
  }

  const name = String(form.get("name") ?? "").trim();
  const mobile = String(form.get("mobile") ?? "").trim();
  const ward = Number(form.get("ward"));
  const category = String(form.get("category") ?? "");
  const description = String(form.get("description") ?? "").trim();

  if (!name || name.length > 100) return bad("name");
  if (!/^[6-9][0-9]{9}$/.test(mobile)) return bad("mobile");
  if (!Number.isInteger(ward) || ward < 1 || ward > 10) return bad("ward");
  if (!(CATEGORIES as readonly string[]).includes(category)) return bad("category");
  if (!description || description.length > 1000) return bad("description");

  try {
    const supabase = db();

    let photoUrl: string | null = null;
    const photo = form.get("photo");
    if (photo instanceof File && photo.size > 0) {
      const ext = PHOTO_TYPES[photo.type];
      if (!ext || photo.size > MAX_PHOTO_BYTES) return bad("photo");
      const path = `${new Date().getFullYear()}/${randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(PHOTO_BUCKET)
        .upload(path, photo, { contentType: photo.type });
      if (upErr) throw upErr;
      photoUrl = supabase.storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl;
    }

    const { data, error } = await supabase
      .from("complaints")
      .insert({ name, mobile, ward, category, description, photo_url: photoUrl })
      .select("tracking_id")
      .single();
    if (error) throw error;

    return NextResponse.json({ trackingId: data.tracking_id });
  } catch (err) {
    console.error("create complaint failed", err);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}
