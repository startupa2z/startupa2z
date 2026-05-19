import React, { useEffect } from "react";

type JsonLd = Record<string, unknown>;

type SEOProps = {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: "summary" | "summary_large_image" | "player" | "app";
  jsonLd?: JsonLd | null;
  keywords?: string[];
  additionalMeta?: { name?: string; property?: string; content: string }[];
  noindex?: boolean;
};

const setOrCreateMeta = (
  attrName: "name" | "property",
  attrValue: string,
  content: string,
) => {
  const selector = `${attrName}="${attrValue}"`;
  let el = document.head.querySelector(
    `meta[${selector}]`,
  ) as HTMLMetaElement | null;
  if (el) {
    el.content = content;
    return;
  }
  el = document.createElement("meta");
  el.setAttribute(attrName, attrValue);
  el.content = content;
  document.head.appendChild(el);
};

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  twitterCard = "summary_large_image",
  jsonLd = null,
  keywords = [],
  additionalMeta = [],
  noindex = false,
}) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) setOrCreateMeta("name", "description", description);
    if (keywords.length)
      setOrCreateMeta("name", "keywords", keywords.join(", "));

    if (noindex) setOrCreateMeta("name", "robots", "noindex, nofollow");
    else setOrCreateMeta("name", "robots", "index, follow");

    // Open Graph
    if (title) setOrCreateMeta("property", "og:title", title);
    if (description) setOrCreateMeta("property", "og:description", description);
    if (ogImage) setOrCreateMeta("property", "og:image", ogImage);
    setOrCreateMeta("property", "og:type", ogType);

    // Twitter
    setOrCreateMeta("name", "twitter:card", twitterCard);
    if (title) setOrCreateMeta("name", "twitter:title", title);
    if (description)
      setOrCreateMeta("name", "twitter:description", description);
    if (ogImage) setOrCreateMeta("name", "twitter:image", ogImage);

    // additional meta tags
    additionalMeta.forEach((m) => {
      if (m.name) setOrCreateMeta("name", m.name, m.content);
      if (m.property) setOrCreateMeta("property", m.property, m.content);
    });

    // canonical link
    if (canonical) {
      let link = document.head.querySelector(
        'link[rel="canonical"]',
      ) as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }
  }, [
    title,
    description,
    canonical,
    ogImage,
    ogType,
    twitterCard,
    keywords,
    additionalMeta,
    noindex,
  ]);

  return jsonLd ? (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }}
    />
  ) : null;
};

export default SEO;
