"use client";
import { useEffect } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function AuthSuccess() {
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10_000);

    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/me`, {
      credentials: "include",
      signal: controller.signal,
    })
      .then((res) => {
        if (res.ok) {
          document.cookie = "isLoggedIn=true; path=/; max-age=604800";
          window.location.replace("/");
        } else {
          window.location.replace("/login");
        }
      })
      .catch((err) => { if (err.name !== "AbortError") window.location.replace("/login"); })
      .finally(() => clearTimeout(timer));

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="text-main" />
    </div>
  );
}
