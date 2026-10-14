import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function Home() {
  const { t } = await getT();
  const buttons = [
    { href: "/complaint", icon: "📝", label: t.btnComplaint, color: "bg-red-600" },
    { href: "/status", icon: "🔍", label: t.btnStatus, color: "bg-blue-600" },
    { href: "/schemes", icon: "🏛️", label: t.btnSchemes, color: "bg-emerald-700" },
    { href: "/notices", icon: "📢", label: t.btnNotices, color: "bg-amber-600" },
  ];
  return (
    <>
      <section className="rounded-2xl bg-white p-5 shadow">
        <h1 className="text-2xl font-extrabold">🙏 {t.appName}</h1>
        <p className="mt-2 text-lg">{t.intro}</p>
        <p className="mt-2 text-base font-semibold text-emerald-800">{t.trial}</p>
      </section>
      <nav className="mt-5 grid grid-cols-2 gap-4">
        {buttons.map((b) => (
          <Link
            key={b.href}
            href={b.href}
            className={`${b.color} flex min-h-40 flex-col items-center justify-center gap-3 rounded-2xl p-4 text-center text-xl font-extrabold text-white shadow active:opacity-80`}
          >
            <span aria-hidden className="text-6xl">{b.icon}</span>
            {b.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
