import { getSiteContent } from "@/lib/content";
import { PageTemplate } from "@/src/views/page-template";
import { PageHeader } from "@/src/views/page-header";
import { ArticlePage } from "@/src/views/article";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const data = await getSiteContent();
  const aboutPage = data?.About?.aboutPage || {};
  const title = aboutPage.title || "Despre noi — Apartenență și crez";
  const description =
    "Cine suntem: Biserica Creștină Baptistă AVA din Târgoviște, parte a Cultului Creștin Baptist din România. Istoria baptiștilor, crezul nostru și principiile Reformei (cele cinci Sola).";
  return {
    title,
    description,
    keywords: [
      "despre Biserica AVA",
      "crez baptist",
      "biserică baptistă Târgoviște",
      "cult creștin baptist România",
      "istoria baptiștilor",
      "principiile Reformei",
      "cele 5 Sola",
    ],
    alternates: { canonical: "/despre-noi" },
    openGraph: {
      type: "article",
      url: "/despre-noi",
      title,
      description,
    },
  };
}

export default async function DespreNoiPage() {
  const data = await getSiteContent();

  return (
    <PageTemplate
      components={[
        { component: PageHeader, props: { title: "Despre noi" } },
        { component: ArticlePage, props: { ...data?.About?.aboutPage } },
      ]}
    />
  );
}
