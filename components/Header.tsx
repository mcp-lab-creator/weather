import Link from "next/link";
import { getT } from "@/lib/lang";
import LangToggle from "./LangToggle";

export default async function Header() {
  const { lang, t } = await getT();
  return (
    <header className="bg-emerald-700 text-white">
      <div className="mx-auto flex max-w-xl items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span aria-hidden>🏡</span>
          {t.appName}
        </Link>
        <LangToggle lang={lang} label={t.switchLang} />
      </div>
    </header>
  );
}
