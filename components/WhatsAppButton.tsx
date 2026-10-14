import { getT } from "@/lib/lang";

export default async function WhatsAppButton() {
  const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  if (!number) return null;
  const { t } = await getT();
  const href = `https://wa.me/${number}?text=${encodeURIComponent(t.whatsappText)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-4 text-lg font-bold text-white shadow-lg active:bg-green-600"
    >
      <span aria-hidden className="text-2xl">💬</span>
      WhatsApp
    </a>
  );
}
