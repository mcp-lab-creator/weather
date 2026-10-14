import { cookies } from "next/headers";
import { dict, LANG_COOKIE, type Lang } from "./i18n";

/** Current language from cookie – Hindi unless the user switched to English. */
export async function getLang(): Promise<Lang> {
  const value = (await cookies()).get(LANG_COOKIE)?.value;
  return value === "en" ? "en" : "hi";
}

export async function getT() {
  const lang = await getLang();
  return { lang, t: dict[lang] };
}
