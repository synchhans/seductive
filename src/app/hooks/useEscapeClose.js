"use client";
import { useEffect } from "react";

export default function useEscapeClose(callback) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") callback();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [callback]);
}