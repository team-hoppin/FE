import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DiagnosisLabel from "@/components/mypage/diagnosis-label";
import { LinkIcon, CirclePlayIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/date";
import { AlbumItem } from "@/types/album";

interface Props {
  album: AlbumItem;
  priority?: boolean;
}

export default function AlbumItemCard({ album, priority = false }: Props) {
  const router = useRouter();

  const { analysis } = album;

  const status = analysis?.status;
  const label = analysis?.label;
  const hasUnreadResult = analysis?.hasUnreadResult;

  // 진단 O
  const isAnalyzed = status === "COMPLETED" && !!label;

  // 진단 O → 확인 X
  const showUnreadDot = isAnalyzed && hasUnreadResult;

  // 진단 X
  const isNotAnalyzed = status === "PENDING" || analysis === null;

  // 진단중
  const isAnalyzing =
    status === "RUNNING" || (status === "COMPLETED" && !label);

  const formattedDate = formatDate(album.createdAt);

  return (
    <div
      className="cursor-pointer"
      onClick={() => router.push(`/album/analysis/${album.promotionId}`)}
    >
      <Card className="border-grey1 rounded-r2 relative flex flex-row gap-5 p-5">
        {showUnreadDot && (
          <div className="bg-danger absolute top-3 left-3 h-2 w-2 rounded-full" />
        )}

        <div className="rounded-r2 shrink-0 overflow-hidden">
          <Image
            src={album.coverImageUrl}
            alt={album.title}
            width={120}
            height={120}
            className="aspect-square object-cover"
            priority={priority}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="h4-bold text-font-basic truncate">{album.title}</h4>

            <div className="flex items-center gap-2">
              <div className="p2-semibold-leading-none text-font-light">
                홍보시작
              </div>
              <span className="bg-border h-3 w-px" />
              <div className="p2-semibold-leading-none text-font-middle">
                {formattedDate}
              </div>
            </div>

            <div className="mb-3 flex gap-2">
              <div className="flex items-center gap-1">
                <LinkIcon className="text-main-light2" size={16} />
                <span className="p1-semibold text-main-mid">
                  {album.totalTrackingLinkClickCount}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CirclePlayIcon className="text-main-light2" size={16} />
                <span className="p1-semibold text-main-mid">
                  {album.totalStreamingLinkClickCount}
                </span>
              </div>
            </div>

            {isAnalyzed && <DiagnosisLabel label={label} />}
          </div>

          {(isNotAnalyzed || isAnalyzing) && (
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="btnPurple"
                className="p2-bold h-9 rounded-full px-5"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  "진단중"
                ) : (
                  <Link href={`/report?promotionId=${album.promotionId}`}>
                    진단하기
                  </Link>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
