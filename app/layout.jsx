import "@/src/styles/tokens.css";
import "@/src/styles/base.css";
import "@/src/styles/components.css";
import "@/src/styles/chatbot.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LegacyHashRedirect } from "@/src/components/legacy-hash-redirect";

const SITE_URL = "https://bisericaava.ro";

const DEFAULT_TITLE =
  "Biserica AVA — Biserică creștină baptistă în Târgoviște";
const DEFAULT_DESCRIPTION =
  "Biserica AVA este o comunitate creștină baptistă (neoprotestantă) din Târgoviște, județul Dâmbovița — oameni născuți din nou. Te așteptăm duminica de la ora 10:00 pe Strada Tineretului 2.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s — Biserica AVA Târgoviște",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "biserică baptistă Târgoviște",
    "biserică creștină Târgoviște",
    "biserică neoprotestantă Târgoviște",
    "biserică baptistă Dâmbovița",
    "Biserica AVA",
    "cult creștin baptist",
    "comunitate creștină Târgoviște",
    "evanghelie Târgoviște",
    "slujbă duminică Târgoviște",
    "biserici Târgoviște",
  ],
  applicationName: "Biserica AVA",
  authors: [{ name: "Biserica AVA", url: SITE_URL }],
  creator: "Biserica AVA",
  publisher: "Biserica AVA",
  category: "religion",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/img/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/img/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/img/favicon/favicon.ico",
    apple: "/img/favicon/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "ro_RO",
    siteName: "Biserica AVA",
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/img/splash.webp",
        width: 1920,
        height: 1081,
        alt: "Comunitatea Bisericii AVA în închinare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/img/splash.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: { telephone: true, address: true, email: true },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// Theme: "sacred" | "reverent" | "airy". Set before paint to avoid a flash,
// honoring an optional ?theme= override. Mirrors the old public/index.html.
const themeScript = `(function () {
  var DEFAULT_THEME = "airy";
  var allowed = ["sacred", "reverent", "airy"];
  var param;
  try { param = new URLSearchParams(location.search).get("theme"); } catch (e) {}
  var theme = allowed.indexOf(param) !== -1 ? param : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", theme);
})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="ro" data-theme="airy" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/img/splash.webp" as="image" type="image/webp" />
        {/* Icons (Font Awesome, local) */}
        <link
          rel="stylesheet"
          type="text/css"
          href="/fonts/font-awesome/css/font-awesome.css"
        />
        {/* Fonts: Fraunces (display) + Inter (body) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body id="page-top">
        <LegacyHashRedirect />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
