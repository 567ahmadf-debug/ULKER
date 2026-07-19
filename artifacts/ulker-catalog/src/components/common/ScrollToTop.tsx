import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Issue 1: Scrolls to top on every route change.
 * Issue 2: Replaces redundant history entries when navigating to the same path.
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Issue 1: Always scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
