import PageTitle from "@/components/PageTitle";
import ComplaintForm from "@/components/ComplaintForm";
import { getT } from "@/lib/lang";

export default async function ComplaintPage() {
  const { lang, t } = await getT();
  return (
    <>
      <PageTitle icon="📝" title={t.complaintTitle} />
      <ComplaintForm lang={lang} />
    </>
  );
}
