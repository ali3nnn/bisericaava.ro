import { Header } from "@/components/header";
import { About } from "@/components/about";
import { Departments } from "@/components/departments";
import { Gallery } from "@/components/gallery";
import Maps from "@/components/maps";
import JsonData from "@/lib/data.json";

export default function Home() {
  return (
    <>
      <Header data={JsonData.Header} />
      <About data={JsonData.About} />
      <Departments data={JsonData.Departments} />
      <Gallery />
      <Maps />
    </>
  );
}
