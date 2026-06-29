import { getSiteContent } from "@/lib/content";
import { PageTemplate } from "@/src/views/page-template";
import { PageHeader } from "@/src/views/page-header";
import { DepartmentsPage } from "@/src/views/departmentsPage";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Departamente — Implică-te în comunitate",
  description:
    "Departamentele Bisericii AVA din Târgoviște — implică-te: binefaceri, AVA Kids (școală duminicală), VIVERE (tineret), consiliere biblică, grupe de casă și predicare.",
  keywords: [
    "departamente Biserica AVA",
    "AVA Kids Târgoviște",
    "școală duminicală Târgoviște",
    "grup de tineret creștin Târgoviște",
    "consiliere biblică",
    "grupe de casă",
    "voluntariat creștin Târgoviște",
  ],
  alternates: { canonical: "/departamente" },
  openGraph: {
    type: "website",
    url: "/departamente",
    title: "Departamente — Biserica AVA Târgoviște",
    description:
      "Implică-te în comunitatea Bisericii AVA: binefaceri, AVA Kids, VIVERE, consiliere biblică, grupe de casă și predicare.",
  },
};

export default async function DepartamentePage() {
  const data = await getSiteContent();

  return (
    <PageTemplate
      components={[
        { component: PageHeader, props: { title: "Departamente" } },
        { component: DepartmentsPage, props: { ...data?.Departments } },
      ]}
    />
  );
}
