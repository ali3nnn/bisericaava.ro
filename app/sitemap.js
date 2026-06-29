const SITE_URL = "https://bisericaava.ro";

export default function sitemap() {
  const now = new Date();
  return ["", "/despre-noi", "/departamente"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
