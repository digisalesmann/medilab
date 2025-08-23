// src/lib/analytics.js
import { useEffect, useState } from "react";

let activityLog = [];
let listeners = [];

/** Record a custom event */
export function trackEvent(type, details = {}) {
  const event = { type, details, timestamp: new Date().toISOString() };
  activityLog.push(event);
  notify();
  return event;
}

/** Record a page view */
export function trackPageView(page = window.location.pathname) {
  const event = { type: "page_view", page, timestamp: new Date().toISOString() };
  activityLog.push(event);
  notify();
  return event;
}

/** Internal: notify subscribers */
function notify() {
  listeners.forEach((cb) => cb([...activityLog]));
}

/** React hook: subscribe to analytics */
export function useAnalytics() {
  const [events, setEvents] = useState(activityLog);

  useEffect(() => {
    const handler = (newEvents) => setEvents(newEvents);
    listeners.push(handler);
    return () => {
      listeners = listeners.filter((l) => l !== handler);
    };
  }, []);

  return {
    events,
    trackEvent,
    trackPageView,
  };
}
