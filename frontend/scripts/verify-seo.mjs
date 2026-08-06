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
requireText(eventHtml, "<title>Bay Area Founders Pitch &amp; Startup Networking — Aug 12 | StartupA2Z</title>", "event title");
requireText(eventHtml, `href="${eventCanonical}"`, "event canonical");
requireText(eventHtml, 'type="application/ld+json"', "event structured data");
requireText(eventHtml, '"@type": "Event"', "Event schema type");
requireText(eventHtml, '"startDate": "2026-08-12T17:00:00-07:00"', "Event start date");
requireText(eventHtml, "https://images.lumacdn.com/event-social/", "event social image");
requireText(eventHtml, "https://luma.com/m0eu7bw9", "Luma registration destination");
rejectText(eventHtml, 'rel="canonical" href="https://startupa2z.org/"', "event canonical");

const eventsHtml = readRoute("/events");
requireText(eventsHtml, "Startup Events — Bay Area | StartupA2Z", "events title");
requireText(eventsHtml, 'href="https://startupa2z.org/events"', "events canonical");
requireText(eventsHtml, "Bay Area Founders Pitch &amp; Startup Networking", "events listing");

const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
requireText(robots, "User-agent: OAI-SearchBot", "robots.txt");
requireText(robots, "Sitemap: https://startupa2z.org/sitemap.xml", "robots.txt");

console.log("SEO verification passed: event HTML, schema, canonical, registration link, and crawler access are present.");
