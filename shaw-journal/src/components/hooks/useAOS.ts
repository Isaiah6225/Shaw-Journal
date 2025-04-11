"use client";
import { useEffect } from "react";

export default function useAOS() {
  useEffect(() => {
    const loadAOS = async () => {
      if (typeof window !== "undefined") {
        const AOS = (await import("aos")).default;
        await import("aos/dist/aos.css");
        AOS.init();
      }
    };

    loadAOS();
  }, []);
}

