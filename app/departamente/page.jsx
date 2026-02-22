import { PageHeader } from "@/components/page-header";
import { DepartmentsPage } from "@/components/departments-page";
import JsonData from "@/lib/data.json";

export const metadata = {
  title: "Departamente — Biserica AVA Targoviste",
  description: "Departamentele Bisericii AVA: Binefaceri, AVA Kids, VIVERE tineret, Consiliere biblica, Grupe de casa, Predicarea.",
  alternates: {
    canonical: "/departamente",
  },
};

export default function Departamente() {
  return (
    <div className="page-template">
      <PageHeader data={{ title: "Departamente" }} />
      <DepartmentsPage data={JsonData.Departments} />
    </div>
  );
}
