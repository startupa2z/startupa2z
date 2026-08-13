import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { recordPageView } from "@/lib/api";

const visitorStorageKey = "startupa2z_visitor_id";

function randomId() {
  return crypto.randomUUID();
}

const PageViewTracker = () => {
  const location = useLocation();
  const lastLocationKey = useRef<string | null>(null);

  useEffect(() => {
    if (location.pathname.startsWith("/admin") || lastLocationKey.current === location.key) return;
    lastLocationKey.current = location.key;

    let visitorId = sessionStorage.getItem(visitorStorageKey);
    if (!visitorId) {
      visitorId = randomId();
      sessionStorage.setItem(visitorStorageKey, visitorId);
    }

    void recordPageView({
      visit_id: randomId(),
      visitor_id: visitorId,
      path: `${location.pathname}${location.search}`,
    }).catch(() => undefined);
  }, [location.key, location.pathname, location.search]);

  return null;
};

export default PageViewTracker;
