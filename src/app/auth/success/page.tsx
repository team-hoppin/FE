"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // setTimeout(() => {
    fetch("https://api.musicpeak.site/api/me", { credentials: "include" })
      .then((res) => {
        if (res.ok) router.replace("/");
        else router.replace("/login");
      })
      .catch(() => router.replace("/login"));
    // }, 30000);//ui확인용
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="text-main" />
    </div>
  );
}
