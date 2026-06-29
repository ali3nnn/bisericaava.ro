import { getSiteContent } from "@/lib/content";
import { Sticky } from "@/src/components/sticky";
import { Contact } from "@/src/components/contact";
import Chatbot from "@/src/components/chatbot";
import { ScrollReveal } from "@/src/components/scroll-reveal";
import { SmoothScroll } from "@/src/components/smooth-scroll";
import { ChurchJsonLd } from "@/src/components/structured-data";

// Always render with fresh CMS content (the /admin editor can change it any
// time). Still fully server-rendered HTML — crawlers get real content.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }) {
  const data = await getSiteContent();

  return (
    <>
      <ChurchJsonLd contact={data.Contact} />
      <ScrollReveal />
      <SmoothScroll />
      <Sticky data={data} />
      {children}
      <Contact data={data.Contact} />
      <Chatbot />
    </>
  );
}
