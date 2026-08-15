/**
 * Production SEO build gate.
 *
 * The app is served as a SPA, so a successful Vite build alone is not enough:
 * crawlers must receive route-specific HTML from the first response. Fail the
 * build if the event snapshot regresses to the homepage metadata.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(scriptDir, "../dist");
const eventSlug = "startup-a-to-z-hacker-dojo-august-12";
const eventCanonical = `https://startupa2z.org/events/${eventSlug}`;
const aug19Slug = "founders-pitch-mix-2026-08-19";
const aug19Canonical = `https://startupa2z.org/events/${aug19Slug}`;

const readRoute = (route) => {
  const file = route === "/"
    ? path.join(dist, "index.html")
    : path.join(dist, route.replace(/^\//, ""), "index.html");
  if (!fs.existsSync(file)) throw new Error(`Missing prerendered route: ${file}`);
  return fs.readFileSync(file, "utf8");
};

const requireText = (html, text, label) => {
  if (!html.includes(text)) throw new Error(`${label}: missing ${text}`);
};

const rejectText = (html, text, label) => {
  if (html.includes(text)) throw new Error(`${label}: unexpectedly contains ${text}`);
};

const eventHtml = readRoute(`/events/${eventSlug}`);
const homeHtml = readRoute("/");
rejectText(homeHtml, "http://localhost:", "homepage build output");
rejectText(homeHtml, "http://127.0.0.1:", "homepage build output");
requireText(eventHtml, "<title>Bay Area Founders Pitch &amp; Startup Networking — Aug 12 | StartupA2Z.org</title>", "event title");
requireText(eventHtml, `href="${eventCanonical}"`, "event canonical");
requireText(eventHtml, 'type="application/ld+json"', "event structured data");
requireText(eventHtml, '"@type": "Event"', "Event schema type");
requireText(eventHtml, '"startDate": "2026-08-12T17:00:00-07:00"', "Event start date");
requireText(eventHtml, "https://images.lumacdn.com/event-social/", "event social image");
requireText(eventHtml, "https://luma.com/m0eu7bw9", "Luma registration destination");
rejectText(eventHtml, 'rel="canonical" href="https://startupa2z.org/"', "event canonical");

const aug19Html = readRoute(`/events/${aug19Slug}`);
requireText(aug19Html, "<title>Bay Area Founder Networking Event in Mountain View | Aug 19</title>", "August 19 event title");
requireText(aug19Html, `href="${aug19Canonical}"`, "August 19 event canonical");
requireText(aug19Html, "Bay Area Founder Networking Event &amp; Startup Workshop", "August 19 primary heading");
requireText(aug19Html, '"@type": "Event"', "August 19 Event schema type");
requireText(aug19Html, '"startDate": "2026-08-19T17:00:00-07:00"', "August 19 Event start date");
requireText(aug19Html, '"endDate": "2026-08-19T20:00:00-07:00"', "August 19 Event end date");
requireText(aug19Html, '"@type": "PostalAddress"', "August 19 postal address");
requireText(aug19Html, "https://startupa2z.org/event-covers/startupa2z-founders-pitch-mix-every-wednesday.png", "August 19 absolute event image");
requireText(aug19Html, "https://luma.com/txup8dqa", "August 19 Luma registration destination");
requireText(aug19Html, '"@type": "FAQPage"', "August 19 FAQ schema");
rejectText(aug19Html, 'rel="canonical" href="https://startupa2z.org/"', "August 19 event canonical");

const eventsHtml = readRoute("/events");
requireText(eventsHtml, "Startup &amp; Founder Networking Events in the Bay Area | StartupA2Z", "events title");
requireText(eventsHtml, "Bay Area Startup Networking and Founder Events", "events primary heading");
requireText(eventsHtml, 'href="https://startupa2z.org/events"', "events canonical");
requireText(eventsHtml, '"name": "Bay Area Founder Networking Event & Startup Workshop"', "events structured listing");
requireText(eventsHtml, "Founder Networking Events", "events search guide");
requireText(eventsHtml, "Startup Pitch Events", "events search guide");
requireText(eventsHtml, "Silicon Valley Founder Meetups", "events search guide");
requireText(eventsHtml, '"@type": "CollectionPage"', "events collection schema");
requireText(eventsHtml, '"@type": "FAQPage"', "events FAQ schema");

const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
requireText(robots, "User-agent: OAI-SearchBot", "robots.txt");
requireText(robots, "Sitemap: https://startupa2z.org/sitemap.xml", "robots.txt");

const sitemap = fs.readFileSync(path.join(dist, "sitemap.xml"), "utf8");
requireText(sitemap, aug19Canonical, "August 19 sitemap entry");

console.log("SEO verification passed: event HTML, schema, canonical, registration link, and crawler access are present.");
