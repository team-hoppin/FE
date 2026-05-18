"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/back-button";
import AlbumItemCard from "@/components/mypage/album-item-card";
import ErrorView from "@/components/common/error-view";
import Link from "next/link";
import { useRef, useEffect } from "react";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import {
  getMyPagePromotions,
  subscribePromotionStream,
} from "@/lib/api/music-promotion";
import FadeMotion from "@/components/common/fade-motion";
import { AlbumItem } from "@/types/album";
import { GetMyPagePromotionsRes } from "@/types/api-response";

export default function MyPage() {
  const queryClient = useQueryClient();

  const observerRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["mypage-promotions"],
    queryFn: ({ pageParam = 0 }) => getMyPagePromotions(pageParam),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (!lastPage.hasNext) return undefined;
      return lastPage.page + 1;
    },
  });

  // SSE 실시간 구독
  useEffect(() => {
    const controller = subscribePromotionStream({
      onPromotionUpdated: (updatedPromotion: AlbumItem) => {
        queryClient.setQueryData<InfiniteData<GetMyPagePromotionsRes>>(
          ["mypage-promotions"],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,

              pages: oldData.pages.map((page) => ({
                ...page,

                promotions: page.promotions.map((promotion) =>
                  promotion.promotionId === updatedPromotion.promotionId
                    ? updatedPromotion
                    : promotion
                ),
              })),
            };
          }
        );
      },
    });

    // 컴포넌트 언마운트 시 SSE 연결 종료
    return () => {
      controller.abort();
    };
  }, [queryClient]);

  // 무한스크롤 observer 등록
  useEffect(() => {
    const target = observerRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "24px",
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const albums = data?.pages.flatMap((page) => page.promotions) ?? [];

  return (
    <FadeMotion x={20}>
      <main className="flex min-h-[calc(100dvh-var(--header-height)-var(--page-padding-bottom))] flex-col">
        <BackButton title="마이페이지" />

        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner className="text-main" />
            </div>
          ) : isError ? (
            <>
              <ErrorView
                title={`요청하신 화면을\n불러오지 못했어요`}
                description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
                onAction={refetch}
                actionLabel="다시 시도하기"
              />
            </>
          ) : albums.length > 0 ? (
            <section className="mt-9 flex flex-col gap-5">
              <div className="flex items-end justify-between">
                <h3 className="h3-bold text-font-basic">앨범 홍보 목록</h3>
                <span className="c1-bold text-font-light">
                  최신순 (업데이트순)
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {albums.map((album, index) => (
                  <AlbumItemCard
                    key={album.promotionId}
                    album={album}
                    priority={index === 0}
                  />
                ))}
              </div>

              {isFetchingNextPage && (
                <div className="flex justify-center py-8">
                  <Spinner className="text-main" />
                </div>
              )}

              <div ref={observerRef} className="h-1" />
            </section>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
              <p className="p2-medium text-font-middle">
                현재 만들어진 홍보 페이지가 없어요.
                <br />
                아래 버튼을 눌러 앨범 홍보를 시작해보세요!
              </p>
              <Button variant="btnPurple" size="full" asChild>
                <Link href="/album">홍보 페이지 만들러 가기 💨</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </FadeMotion>
  );
}
