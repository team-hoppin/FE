"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  url: string;
  promotionId: number;
  isLoggedIn: boolean;
  fromAnalysis: boolean;
}

export default function AlbumActionButton({
  url,
  promotionId,
  isLoggedIn,
  fromAnalysis,
}: Props) {
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("링크가 복사되었습니다!", { position: "bottom-center" });

      if (isLoggedIn) {
        router.push("/album/promote");
      }
    } catch {
      toast.error("복사에 실패했습니다.", { position: "bottom-center" });
    }
  };

  const handleEdit = () => {
    router.push(
      `/album?edit=${promotionId}&from=${fromAnalysis ? "analysis" : "detail"}`
    );
  };

  return (
    <div className="flex gap-2">
      {fromAnalysis ? (
        <Button
          variant="btnPurple"
          size="md"
          onClick={() => router.push("/mypage")}
        >
          마이페이지 이동
        </Button>
      ) : (
        <Button variant="btnPurple" size="md" onClick={handleCopy}>
          🔗 링크 복사
        </Button>
      )}

      {isLoggedIn && (
        <Button variant="btnPurpleSub" size="md" onClick={handleEdit}>
          수정하기
        </Button>
      )}
    </div>
  );
}
