import { getSiteContent } from "@/lib/content";
import { Header } from "@/src/components/header";
import { About } from "@/src/components/about";
import { Departments } from "@/src/components/departments";
import { Gallery } from "@/src/components/gallery";
import Maps from "@/src/components/maps";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getSiteContent();

  return (
    <>
      <Header data={data.Header} />
      <About data={data.About} />
      <Departments data={data.Departments} />
      <Gallery data={data.Gallery} />
      <Maps data={data.Maps} />
    </>
  );
}
