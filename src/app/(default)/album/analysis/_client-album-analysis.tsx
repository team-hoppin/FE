"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/common/back-button";
import AlbumAnalysisActionButton from "@/components/mypage/album-analysis-action-button";
import DiagnosisItemCard from "@/components/mypage/diagnosis-item-card";
import { LinkIcon, CirclePlayIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getAnalysisPage } from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";
import { mapToStreamingBtn } from "@/utils/mapper";
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

        <section className="mb-1 flex flex-col gap-6">
          <h4 className="h4-bold text-font-basic">실시간 홍보 현황이에요</h4>

          <ul className="flex gap-5">
            <li className="flex flex-col items-center gap-3">
              <div className="bg-main-light1 inline-flex rounded-sm px-2 py-1">
                <span className="c1-medium text-font-middle">
                  홍보링크 방문자 수
                </span>
              </div>

              <div className="flex items-center gap-1">
                <LinkIcon className="text-main-light2 mr-1" size={16} />
                <span className="h1-semibold text-main-mid leading-none">
                  {data.realtimeStats.trackingClickCount}
                </span>
                <span className="p1-bold text-main-mid self-end">명</span>
              </div>
            </li>

            <li className="flex flex-col items-center gap-3">
              <div className="bg-main-light1 inline-flex rounded-sm px-2 py-1">
                <span className="c1-medium text-font-middle">
                  스트리밍 이동 횟수
                </span>
              </div>

              <div className="flex items-center gap-1">
                <CirclePlayIcon className="text-main-light2 mr-1" size={16} />
                <span className="h1-semibold text-main-mid leading-none">
                  {data.realtimeStats.streamingClickCount}
                </span>
                <span className="p1-bold text-main-mid self-end">회</span>
              </div>
            </li>
          </ul>
        </section>

        <Separator className="-mx-5" />

        <section className="mb-1 flex flex-col gap-6">
          <h4 className="h4-bold text-font-basic">
            어떤 스트리밍 사이트로 이동했나요?
          </h4>

          <ul className="flex flex-col gap-5">
            {data.streamingLinks.map((item) => {
              const streamingCode = getStreamingCode(item.url);
              const streamingItem = mapToStreamingBtn[streamingCode!];

              return (
                <li
                  key={streamingItem.label}
                  className="flex justify-between px-1 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={streamingItem.icon}
                      alt={streamingItem.label}
                      width={32}
                      height={32}
                      className="shrink-0"
                    />

                    <span className="p1-bold-leading-none text-font-middle">
                      {streamingItem.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Progress className="w-20" value={item.clickShareRate} />

                    <span className="p2-semibold text-font-middle relative top-px w-10 text-left">
                      {item.clickShareRate}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <Separator className="-mx-5" />

        <section className="mb-1 flex flex-col gap-6">
          <h4 className="h4-bold text-font-basic">지금 바로 바꿔보세요</h4>

          <ul className="flex flex-col gap-6">
            {data.diagnosis.map((item) => (
              <li key={item.diagnosisId}>
                <DiagnosisItemCard {...item} />
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Button variant="btnPurple" size="full">
        이 앨범 홍보 다시 진단받기
      </Button>
    </div>
  );
}
