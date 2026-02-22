import { SpeedInsights } from "@vercel/speed-insights/next";
import { Sticky } from "@/components/sticky";
import { Contact } from "@/components/contact";
import JsonData from "@/lib/data.json";

export const metadata = {
  title: {
    default: "Biserica Crestina Baptista AVA | Targoviste",
    template: "%s | Biserica AVA",
  },
  description: "Biserica Crestina Baptista AVA din Targoviste. Program: Duminica 10:00, Miercuri 19:00. O comunitate de oameni nascuti din nou.",
  authors: [{ name: "@BisericaAva" }],
  metadataBase: new URL("https://bisericaava.ro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Biserica Crestina Baptista AVA",
    description: "O comunitate de oameni nascuti din nou. Targoviste, Romania.",
    url: "https://bisericaava.ro",
    siteName: "Biserica AVA",
    images: [{ url: "/img/splash.webp" }],
    locale: "ro_RO",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/img/favicon/favicon.ico" },
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16" },
      { url: "/img/favicon/favicon-32x32.png", sizes: "32x32" },
    ],
    apple: "/img/favicon/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preload" href="/img/splash.webp" as="image" type="image/webp" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link rel="stylesheet" type="text/css" href="/css/bootstrap.css" />
        <link rel="stylesheet" type="text/css" href="/fonts/font-awesome/css/font-awesome.css" />
        <link rel="stylesheet" type="text/css" href="/css/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Lato:wght@400;700&family=Raleway:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Church",
              "@id": "https://bisericaava.ro/#church",
              "name": "Biserica Crestina Baptista AVA",
              "alternateName": "Biserica AVA",
              "description": "O comunitate de oameni nascuti din nou",
              "url": "https://bisericaava.ro",
              "telephone": "+40785541595",
              "email": "avachurch19@gmail.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Strada Tineretului 2",
                "addressLocality": "Targoviste",
                "addressRegion": "Dambovita",
                "addressCountry": "RO",
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 44.92639,
                "longitude": 25.44564,
              },
              "image": "https://bisericaava.ro/img/splash.webp",
              "logo": "https://bisericaava.ro/img/favicon/android-chrome-512x512.png",
              "sameAs": [
                "https://www.facebook.com/BisericaAva",
                "https://www.youtube.com/@bisericaava",
              ],
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Wednesday",
                  "opens": "19:00",
                  "closes": "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": "Sunday",
                  "opens": "10:00",
                  "closes": "12:00",
                },
              ],
              "isAccessibleForFree": true,
              "publicAccess": true,
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://bisericaava.ro/#website",
              "name": "Biserica AVA",
              "url": "https://bisericaava.ro",
              "publisher": { "@id": "https://bisericaava.ro/#church" },
              "inLanguage": "ro",
            }),
          }}
        />
      </head>
      <body id="page-top">
        <Sticky />
        {children}
        <Contact data={JsonData.Contact} />
        <SpeedInsights />
      </body>
    </html>
  );
}
