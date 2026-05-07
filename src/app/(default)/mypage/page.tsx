"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import AlbumItemCard from "@/components/mypage/album-item-card";
import ErrorView from "@/components/common/error-view";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlbumItem } from "@/types/album";

const MOCK_ALBUMS: AlbumItem[] = [
  {
    promotionId: 1,
    title: "김피크와 함께라면",
    coverImageUrl:
      "https://hoppin-s3-bucket.s3.ap-northeast-2.amazonaws.com/music-promotions/2606043b-e54e-42dc-91e7-459ddc697742.png",
    createdAt: "26.05.10",
    totalTrackingLinkClickCount: 10,
    totalStreamingLinkClickCount: 24,
    analysis: {
      status: "COMPLETED",
      label: "효과적인 홍보",
      hasUnreadResult: true,
    },
  },
  {
    promotionId: 2,
    title: "이피크와 함께라면",
    coverImageUrl:
      "https://hoppin-s3-bucket.s3.ap-northeast-2.amazonaws.com/music-promotions/2606043b-e54e-42dc-91e7-459ddc697742.png",
    createdAt: "26.05.20",
    totalTrackingLinkClickCount: 13,
    totalStreamingLinkClickCount: 8,
    analysis: {
      status: "COMPLETED",
      label: "피드 반응 부족",
      hasUnreadResult: false,
    },
  },
  {
    promotionId: 3,
    title: "피크랑 피크닉",
    coverImageUrl:
      "https://hoppin-s3-bucket.s3.ap-northeast-2.amazonaws.com/music-promotions/2606043b-e54e-42dc-91e7-459ddc697742.png",
    createdAt: "26.05.30",
    totalTrackingLinkClickCount: 2,
    totalStreamingLinkClickCount: 9,
    analysis: {
      status: "PENDING",
      label: null,
      hasUnreadResult: true,
    },
  },
  {
    promotionId: 4,
    title: "피크파이팅피크파이팅피크파이팅",
    coverImageUrl:
      "https://hoppin-s3-bucket.s3.ap-northeast-2.amazonaws.com/music-promotions/2606043b-e54e-42dc-91e7-459ddc697742.png",
    createdAt: "26.05.30",
    totalTrackingLinkClickCount: 4,
    totalStreamingLinkClickCount: 6,
    analysis: {
      status: "RUNNING",
      label: null,
      hasUnreadResult: true,
    },
  },
];

export default function MyPage() {
  const router = useRouter();

  const isLoading = false;
  const isError = false;
  const albums = MOCK_ALBUMS;

  return (
    <main className="flex flex-1 flex-col gap-9">
      <header className="text-font-middle relative flex items-center">
        <button className="cursor-pointer" onClick={() => router.back()}>
          <ChevronLeftIcon size={32} />
        </button>
        <h3 className="h3-bold absolute left-1/2 -translate-x-1/2">
          마이페이지
        </h3>
      </header>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-main" />
        </div>
      ) : isError ? (
        <>
          <ErrorView
            title={`요청하신 화면을\n불러오지 못했어요`}
            description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
            // onAction={refetch}
            onAction={() => {}}
            actionLabel="다시 시도하기"
          />
        </>
      ) : albums.length > 0 ? (
        <section className="flex flex-col gap-5">
          <div className="flex items-end justify-between">
            <h3 className="h3-bold text-font-basic">앨범 홍보 목록</h3>
            <span className="c1-bold text-font-light">최신순 (업데이트순)</span>
          </div>

          <div className="flex flex-col gap-2">
            {albums.map((album) => (
              <AlbumItemCard key={album.promotionId} album={album} />
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <p className="p2-medium text-font-middle">
            현재 만들어진 홍보 페이지가 없어요.
            <br />
            링크를 만들고 앨범 홍보를 시작해보세요!
          </p>
          <Button variant="btnPurple" size="full" asChild>
            <Link href="/album">홍보 링크 만들러 가기 💨</Link>
          </Button>
        </div>
      )}
    </main>
  );
}
