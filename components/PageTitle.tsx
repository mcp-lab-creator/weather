import Link from "next/link";
import { getT } from "@/lib/lang";

export default async function PageTitle({ icon, title }: { icon: string; title: string }) {
  const { t } = await getT();
  return (
    <div className="mb-5">
      <Link href="/" className="inline-block py-2 text-lg font-bold text-emerald-800 underline">
        ← {t.home}
      </Link>
      <h1 className="mt-1 flex items-center gap-3 text-3xl font-extrabold">
        <span aria-hidden>{icon}</span>
        {title}
      </h1>
    </div>
  );
}
