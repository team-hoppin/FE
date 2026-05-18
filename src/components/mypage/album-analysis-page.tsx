"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/common/back-button";
import AlbumAnalysisActionButton from "@/components/mypage/album-analysis-action-button";
import RealtimeStatusSection from "@/components/mypage/analysis-realtime-status-section";
import StreamingSection from "@/components/mypage/analysis-streaming-section";
import DiagnosisSection from "@/components/mypage/analysis-diagnosis-section";
import ErrorView from "@/components/common/error-view";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { patchDiagnosisRead, getAnalysisPage } from "@/lib/api/music-promotion";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { formatDate } from "@/utils/date";

interface Props {
  promotionId: number;
}

export default function AlbumAnalysisPage({ promotionId }: Props) {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

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
    queryKey: ["analysis-page", promotionId],

    queryFn: ({ pageParam = 0 }) => getAnalysisPage(promotionId, pageParam),

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      if (!lastPage.diagnosisPage.hasNext) return undefined;

      return lastPage.diagnosisPage.page + 1;
    },
  });

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

  const analysisData = data?.pages[0];
  const diagnosisList = data?.pages.flatMap((page) => page.diagnosis) ?? [];

  // 진단 내역 존재 여부
  const hasDiagnosis = diagnosisList.length > 0;

  // 진단중인 내역 존재 여부
  const hasAnalyzing = diagnosisList.some(
    (item) => item.status === "PENDING" || item.status === "RUNNING"
  );

  useEffect(() => {
    if (!hasDiagnosis) return;

    patchDiagnosisRead(promotionId);
  }, [promotionId, hasDiagnosis]);

  if (isError) {
    return (
      <ErrorView
        title={`요청하신 화면을\n불러오지 못했어요`}
        description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
        onAction={refetch}
        actionLabel="다시 시도하기"
      />
    );
  }

  if (isLoading || !analysisData) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="text-main" />
      </div>
    );
  }

  const handleDiagnosis = () => {
    if (hasAnalyzing) {
      openAlertModal({
        type: "alert",
        variant: "warning",
        message: (
          <>
            이미 진단이 진행되고 있어요.{"\n"}
            <span className="p2-semibold">
              한 번에 하나의 페이지만 진단할 수 있어요.{"\n"}
            </span>
            결과가 나온 뒤 다시 신청해주세요!
          </>
        ),
      });

      return;
    }

    router.push(`/report?promotionId=${analysisData.promotionId}`);
  };

  return (
    <div className="mb-6 flex flex-col gap-7">
      <BackButton title={analysisData.songTitle} />

      <main className="mb-2 flex flex-col gap-7">
        <section className="mb-1 flex flex-col items-center gap-6 px-9">
          <div className="flex flex-col gap-3">
            <div className="rounded-r2 h-[126px] w-[126px] shrink-0 overflow-hidden">
              <Image
                src={analysisData.imageUrl}
                alt={analysisData.songTitle}
                width={126}
                height={126}
                className="h-full w-full object-cover"
                loading="eager"
              />
            </div>

            <ul className="flex flex-col">
              <li className="flex items-center justify-center gap-2">
                <div className="p1-semibold-leading-none text-font-light">
                  발매일
                </div>
                <span className="bg-border h-4 w-px" />
                <div className="p1-semibold-leading-none text-font-middle">
                  {formatDate(analysisData.releaseDate)}
                </div>
              </li>

              <li className="flex items-center justify-center gap-2">
                <div className="p1-semibold-leading-none text-font-light">
                  홍보시작
                </div>
                <span className="bg-border h-3 w-px" />
                <div className="p1-semibold-leading-none text-font-middle">
                  {formatDate(analysisData.createdAt)}
                </div>
              </li>
            </ul>
          </div>

          <AlbumAnalysisActionButton
            promotionId={analysisData.promotionId}
            trackingUrl={analysisData.trackingUrl}
          />
        </section>

        <Separator className="-mx-5" />

        <RealtimeStatusSection realtimeStats={analysisData.realtimeStats} />

        <Separator className="-mx-5" />

        <StreamingSection streamingLinks={analysisData.streamingLinks} />

        {hasDiagnosis && (
          <>
            <Separator className="-mx-5" />

            <DiagnosisSection
              promotionId={analysisData.promotionId}
              diagnosis={diagnosisList}
            />

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Spinner className="text-main" />
              </div>
            )}

            <div ref={observerRef} className="-mt-7 h-1" />
          </>
        )}
      </main>

      <Button variant="btnPurple" size="full" onClick={handleDiagnosis}>
        {hasDiagnosis
          ? "이 앨범 홍보 다시 진단 받기"
          : "이 앨범 홍보 진단 받기"}
      </Button>
    </div>
  );
}
