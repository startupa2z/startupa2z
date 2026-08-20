import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL for the site
const baseUrl = "https://startupa2z.org";

// Statically map pages in src/pages. Update if you add pages or dynamic routes.
const staticRoutes = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/events/startup-a-to-z-hacker-dojo-august-12",
  "/events/founders-pitch-mix-2026-08-25",
  "/events/founder-networking-workshop-2026-09-01",
  "/events/founders-pitch-mix-2026-09-08",
  "/events/founders-pitch-mix-2026-09-15",
  "/events/founders-pitch-mix-2026-09-22",
  "/events/founders-pitch-mix-2026-09-29",
  "/founders",
  "/investors",
  "/resources",
  "/sponsorship",
  "/startups",
];

const publicDir = path.join(__dirname, "..", "public");
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);

const today = new Date().toISOString();

const urls = staticRoutes
  .map((route) => {
    const isEventRoute = route === "/events" || route.startsWith("/events/");
    const changefreq = isEventRoute ? "daily" : "weekly";
    const priority = isEventRoute ? "0.9" : "0.7";
    return `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), `${xml}\n`);
console.log("sitemap.xml generated at public/sitemap.xml");
