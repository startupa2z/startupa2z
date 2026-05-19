/**
 * Navigate the top-level window (breaks out of Cursor/IDE embedded browser iframes).
 * OAuth providers block redirects inside iframes — causes
 * "Unsafe attempt to load URL ... from frame with URL chrome-error://chromewebdata/".
 */
export function assignTopLevel(url: string) {
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.assign(url);
      return;
    }
  } catch {
    // Blocked cross-origin iframe access — fall through to new tab
  }

  const opened = window.open(url, "_blank", "noopener,noreferrer");
  if (!opened) {
    window.location.assign(url);
  }
}
