"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/common/back-button";
import AlbumAnalysisActionButton from "@/components/mypage/album-analysis-action-button";
import RealtimeStatusSection from "@/components/mypage/analysis-realtime-status-section";
import StreamingSection from "@/components/mypage/analysis-streaming-section";
import DiagnosisSection from "@/components/mypage/analysis-diagnosis-section";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAnalysisPage } from "@/lib/api/music-promotion";
import { formatDate } from "@/utils/date";
import { GetAnalysisPageRes } from "@/types/api-response";

interface Props {
  promotionId: number;
}

export default function AlbumAnalysisPage({ promotionId }: Props) {
  const [data, setData] = useState<GetAnalysisPageRes | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAnalysisPage(promotionId);

        setData(res);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [promotionId]);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-main" />
      </div>
    );
  }
  const hasDiagnosis = data.diagnosis.length > 0; // 진단 내역 존재 여부

  return (
    <div className="mb-6 flex flex-col gap-7">
      <BackButton title={data.songTitle} />

      <main className="mb-2 flex flex-col gap-7">
        <section className="mb-1 flex flex-col items-center gap-6 px-9">
          <div className="flex flex-col gap-3">
            <div className="rounded-r2 shrink-0 overflow-hidden">
              <Image
                src={data.imageUrl}
                alt={data.songTitle}
                width={126}
                height={126}
                className="aspect-square object-cover"
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
                  {formatDate(data.releaseDate)}
                </div>
              </li>

              <li className="flex items-center justify-center gap-2">
                <div className="p1-semibold-leading-none text-font-light">
                  홍보시작
                </div>
                <span className="bg-border h-3 w-px" />
                <div className="p1-semibold-leading-none text-font-middle">
                  {formatDate(data.createdAt)}
                </div>
              </li>
            </ul>
          </div>

          <AlbumAnalysisActionButton
            promotionId={data.promotionId}
            trackingUrl={data.trackingUrl}
          />
        </section>

        <Separator className="-mx-5" />

        <RealtimeStatusSection realtimeStats={data.realtimeStats} />

        <Separator className="-mx-5" />

        <StreamingSection streamingLinks={data.streamingLinks} />

        {hasDiagnosis && (
          <>
            <Separator className="-mx-5" />

            <DiagnosisSection
              promotionId={data.promotionId}
              diagnosis={data.diagnosis}
            />
          </>
        )}
      </main>

      <Button variant="btnPurple" size="full">
        이 앨범 홍보 다시 진단받기
      </Button>
    </div>
  );
}
