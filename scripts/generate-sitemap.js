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
  "/community",
  "/contact",
  "/events",
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
    return `  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml);
console.log("sitemap.xml generated at public/sitemap.xml");
