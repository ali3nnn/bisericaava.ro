import React from "react";

const SITE_URL = "https://bisericaava.ro";

// Church / local-business structured data (JSON-LD). This is the single most
// valuable SEO signal for a local congregation: it tells Google the site maps
// to a physical place of worship in Târgoviște and exposes the address, service
// times and social profiles for local search ("biserică baptistă Târgoviște")
// and Knowledge Panel results. Fed from the live CMS contact block so it stays
// in sync with what visitors see on the page.
export function ChurchJsonLd({ contact = {} }) {
  const sameAs = [contact.facebook, contact.youtube].filter(Boolean);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Church",
    "@id": `${SITE_URL}/#church`,
    name: "Biserica Creștină Baptistă AVA",
    alternateName: ["Biserica AVA", "Biserica AVA Târgoviște"],
    description:
      "Biserică creștină baptistă (neoprotestantă) din Târgoviște, județul Dâmbovița — o comunitate de oameni născuți din nou. Slujbe duminica de la ora 10:00 și miercuri de la ora 19:00.",
    url: SITE_URL,
    logo: `${SITE_URL}/img/favicon/android-chrome-512x512.png`,
    image: `${SITE_URL}/img/splash.webp`,
    telephone: contact.phone || "+40 785 541 595",
    email: contact.email || "avachurch19@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.address || "Strada Tineretului 2",
      addressLocality: "Târgoviște",
      addressRegion: "Dâmbovița",
      addressCountry: "RO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 44.926389,
      longitude: 25.445638,
    },
    hasMap: contact.gmaps || "https://maps.app.goo.gl/W85vQDMNpvfqsvA99",
    areaServed: { "@type": "City", name: "Târgoviște" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "10:00",
        closes: "12:00",
        name: "Slujba de închinare",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Wednesday",
        opens: "19:00",
        closes: "20:30",
        name: "Întâlnire de rugăciune și studiu biblic",
      },
    ],
    sameAs: sameAs.length ? sameAs : undefined,
    parentOrganization: {
      "@type": "Organization",
      name: "Cultul Creștin Baptist din România",
    },
    keywords:
      "biserică baptistă Târgoviște, biserică creștină Târgoviște, biserică neoprotestantă Dâmbovița, cult creștin baptist, comunitate creștină",
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify drops the `undefined` sameAs key, so this stays valid.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
