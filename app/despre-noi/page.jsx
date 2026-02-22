import { PageHeader } from "@/components/page-header";
import { ArticlePage } from "@/components/article";
import JsonData from "@/lib/data.json";

export const metadata = {
  title: "Despre Noi — Biserica Baptista AVA Targoviste",
  description: "Istoria si credinta Bisericii Baptiste AVA din Targoviste. Principiile noastre biblice si cele 5 Sola ale Reformei.",
  alternates: {
    canonical: "/despre-noi",
  },
};

export default function DespreNoi() {
  return (
    <div className="page-template">
      <PageHeader data={{ title: "Despre noi" }} />
      <ArticlePage data={JsonData.About.aboutPage} />
    </div>
  );
}
