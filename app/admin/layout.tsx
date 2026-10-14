import Link from "next/link";
import { logout } from "./actions";
import { isAdmin } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAdmin();
  return (
    <>
      {authed && (
        <nav className="mb-5 flex flex-wrap items-center gap-2 text-base font-bold">
          <Link href="/admin" className="rounded-lg bg-white px-4 py-2 shadow">Complaints</Link>
          <Link href="/admin/schemes" className="rounded-lg bg-white px-4 py-2 shadow">Schemes</Link>
          <Link href="/admin/notices" className="rounded-lg bg-white px-4 py-2 shadow">Notices</Link>
          <form action={logout} className="ml-auto">
            <button className="rounded-lg bg-stone-700 px-4 py-2 text-white">Logout</button>
          </form>
        </nav>
      )}
      {children}
    </>
  );
}
