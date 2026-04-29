"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export default function HomeButtons({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [showIntro, setShowIntro] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("onboarding")) {
      router.replace("/onboarding");
      return;
    }
    if (!localStorage.getItem("peak-intro-seen")) {
      setShowIntro(true);
    }
  }, [router]);

  const dismissIntro = () => {
    localStorage.setItem("peak-intro-seen", "true");
    setShowIntro(false);
  };

  const handleCta = (path: string) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(path);
  };

  return (
    <>
      {showIntro && (
        <div
          className="fixed inset-0 z-1000 bg-black/50"
          onClick={dismissIntro}
        />
      )}
      <div className="flex flex-col gap-4">
        <Tooltip open={showIntro}>
          <TooltipTrigger asChild>
            <Button
              variant="btnPurple"
              size="full"
              onClick={() => handleCta("/album")}
            >
              신곡 홍보 링크 만들기
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              발매 정보를 입력하면 <strong>팬에게 바로</strong>
              <br />
              <strong>공유</strong>할 수 있는 링크가 생겨요
            </p>
          </TooltipContent>
        </Tooltip>
        <Tooltip open={showIntro}>
          <TooltipTrigger asChild>
            <Button
              variant="btnWhite"
              size="full"
              onClick={() => handleCta("/report")}
            >
              내 음원 홍보 진단하기
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              지금 <strong>팬이 왜 안 늘고 있는지</strong>,
              <br />
              다음엔 뭘 하면 좋을지 알려드려요
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </>
  );
}
