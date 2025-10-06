// src/components/ScrollRestoration.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const scrollPositions = {};

export default function ScrollRestoration() {
  const location = useLocation();

  useEffect(() => {
    // Restore scroll position if we have it
    const savedPosition = scrollPositions[location.pathname];
    if (savedPosition) {
      window.scrollTo(0, savedPosition);
    } else {
      window.scrollTo(0, 0);
    }

    const handleScroll = () => {
      scrollPositions[location.pathname] = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return null;
}
