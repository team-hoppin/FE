import Image from "next/image";
import { Card } from "@/components/ui/card";
import { AlbumItem } from "@/types/album";
import { CirclePlayIcon, LinkIcon } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  album: AlbumItem;
}

export default function AlbumItemCard({ album }: Props) {
  const { analysis } = album;

  // 진단 O → 확인 X
  const showUnreadDot =
    analysis.status === "COMPLETED" && analysis.hasUnreadResult;

  // 진단 O
  const isCompleted = analysis.status === "COMPLETED" && analysis.label;

  // 진단 X
  const isPending = analysis.status === "PENDING";

  // 진단중
  const isRunning = analysis.status === "RUNNING";

  return (
    <div>
      <Card className="border-grey1 relative flex flex-row gap-5 rounded-3xl p-5">
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
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="h4-bold text-font-basic truncate">{album.title}</h4>

            <p className="p2-semibold text-font-middle">
              홍보시작 | {album.createdAt}
            </p>

            <div className="flex gap-2">
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

            {isCompleted && (
              <div className="border-main-light2 bg-main-light1 mt-3 inline-flex w-fit rounded-full border px-3 py-1">
                <span className="p2-semibold text-main-mid">
                  {analysis.label}
                </span>
              </div>
            )}
          </div>

          {(isPending || isRunning) && (
            <div className="mt-3">
              <Button
                variant="btnPurple"
                className="p2-bold h-9 rounded-full px-5"
                disabled={isRunning}
              >
                {isRunning ? "진단중" : "진단하기"}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
