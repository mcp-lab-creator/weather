import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getT } from "@/lib/lang";

export const metadata: Metadata = {
  title: "स्मार्ट पचेरी | Smart Pacheri",
  description: "Pacheri Gram Panchayat – complaints, schemes and notices",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { lang, t } = await getT();
  return (
    <html lang={lang}>
      <body>
        <Header />
        <main className="mx-auto max-w-xl px-4 pb-28 pt-5">{children}</main>
        <footer className="mx-auto max-w-xl px-4 pb-24 text-center text-sm text-stone-500">
          {t.gp}
        </footer>
        <WhatsAppButton />
      </body>
    </html>
  );
}
