import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { deleteMusicPromotion } from "@/lib/api/music-promotion";

interface Props {
  promotionId: number;
  trackingUrl: string;
}

export default function AlbumAnalysisActionButton({
  promotionId,
  trackingUrl,
}: Props) {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

  // 홍보 페이지 수정
  const handleEdit = () => {
    router.push(`/album?edit=${promotionId}&from=analysis`);
  };

  // 홍보 페이지 삭제
  const handleDelete = () => {
    openAlertModal({
      type: "confirm",
      variant: "danger",
      message: (
        <>
          이 페이지를 삭제하면{"\n"}
          <span className="p2-semibold">
            반응 수집이 중지되고 저장된 기록이 모두 사라져요.
          </span>
          {"\n"}
          그래도 삭제하시겠어요?
        </>
      ),
      onAction: async () => {
        try {
          await deleteMusicPromotion(promotionId);
          toast.success("삭제되었습니다.", { position: "bottom-center" });
          router.replace("/mypage");
        } catch {
          toast.error("삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.", {
            position: "bottom-center",
          });
        }
      },
    });
  };

  // 홍보 페이지 링크 복사
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl);
      toast.success("링크가 복사되었습니다!", { position: "bottom-center" });
    } catch {
      toast.error("복사에 실패했습니다.", { position: "bottom-center" });
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex gap-3">
        <Button
          variant="btnPurpleSub"
          className="p2-bold h-9 flex-1 rounded-full"
          onClick={handleEdit}
        >
          홍보 페이지 수정
        </Button>
        <Button
          variant="btnPurpleSub"
          className="p2-bold h-9 flex-1 rounded-full"
          onClick={handleDelete}
        >
          {" "}
          홍보 페이지 삭제
        </Button>
      </div>
      <Button
        variant="btnPurple"
        className="p2-bold h-9 w-full rounded-full"
        onClick={handleCopy}
      >
        🔗 홍보 페이지 링크 복사
      </Button>
    </div>
  );
}
