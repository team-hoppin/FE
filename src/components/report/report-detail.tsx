"use client";

import BackButton from "@/components/common/back-button";
import ErrorView from "@/components/common/error-view";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, Calendar, ChevronRight } from "lucide-react";
import { toJpeg } from "html-to-image";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getDiagnosisDetail, getMusicPromotion } from "@/lib/api/music-promotion";
import { GetDiagnosisDetailRes } from "@/types/api-response";

const SUMMARY_METRICS = [
  { label: "피드 반응률", key: "followerEngagementRate" },
  { label: "홍보링크 클릭률", key: "promoClickRateByEngagement" },
  { label: "스트리밍 클릭률", key: "streamingClickRateByPromoClick" },
] as const;

export default function ReportDetail() {
  const params = useParams<{ promotionId: string }>();
  const promotionId = Number(params.promotionId);
  const searchParams = useSearchParams();
  const diagnosisId = searchParams.get("diagnosisId")
    ? Number(searchParams.get("diagnosisId"))
    : undefined;
  const [data, setData] = useState<GetDiagnosisDetailRes | null>(null);
  const [songTitle, setSongTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsEmpty(false);
    try {
      if (!diagnosisId) {
        setIsEmpty(true);
        return;
      }
      const [promotion, detail] = await Promise.all([
        getMusicPromotion(promotionId),
        getDiagnosisDetail(promotionId, diagnosisId),
      ]);
      setSongTitle(promotion.songTitle);
      setData(detail);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [promotionId, diagnosisId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveImage = async () => {
    const target = document.getElementById("app-root");
    if (!target) return;
    try {
      const dataUrl = await toJpeg(target, {
        cacheBust: true,
        pixelRatio: 2,
        filter: (node: HTMLElement) => !node.dataset?.captureIgnore,
      });
      const blob = await fetch(dataUrl).then((r) => r.blob());
      const file = new File([blob], "report.jpg", { type: "image/jpeg" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file] });
      } else {
        const link = document.createElement("a");
        link.download = "report.jpg";
        link.href = dataUrl;
        link.click();
      }
    } catch {
      toast.error("이미지 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="text-main" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorView
        title={"요청하신 화면을\n불러오지 못했어요"}
        description={
          "페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요."
        }
        onAction={load}
      />
    );
  }

  if (isEmpty || !data)
    return (
      <ErrorView
        title={"진단 결과를 찾을 수 없어요"}
        description={
          "진단결과가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요."
        }
      />
    );

  const from = data.diagnosis.highlightFrom;
  const to = data.diagnosis.highlightTo;

  return (
    <>
      <BackButton href="/report" />
      <main className="flex flex-col gap-9">
        <div className="bg-allwhite flex min-h-screen flex-col gap-9">
          <div className="flex flex-col items-start gap-1">
            <h2 className="h2-bold text-font-basic">
              {songTitle || "앨범"}의 홍보 현황이에요
            </h2>
            <div className="border-border text-font-middle flex items-center gap-2 rounded-full border px-4 py-2">
              <Calendar size={16} />
              <span className="p2-medium">
                {data.periodLabel || "-"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-9">
            <section className="grid grid-cols-3 gap-5 text-center">
              {SUMMARY_METRICS.map(({ label, key }) => (
                <div
                  key={label}
                  className="box-item rounded-r2 bg-grey1 flex flex-col justify-start gap-2.5 p-2.5"
                >
                  <div className="c1-medium text-font-middle rounded-r1 w-full bg-white py-1 break-keep">
                    {label}
                  </div>
                  <h1 className="text-main flex items-center justify-center gap-1">
                    <span className="h2-bold">
                      {Math.round(data.summaryMetrics[key] * 10) / 10}
                    </span>
                    <span className="p1-bold">%</span>
                  </h1>
                </div>
              ))}
            </section>

            <section className="border-border rounded-r3 flex flex-col gap-4 border p-5">
              <h6 className="text-font-middle p1-bold flex flex-col gap-1">
                지금 홍보가 막힌 단계는
                <span className="text-main-dark1 h3-bold flex items-center gap-1">
                  {from}
                  <ChevronRight size={24} />
                  {to}
                </span>
                이에요
              </h6>
              <div className="bg-brand-gradient rounded-r2 c1-medium p-4 break-keep whitespace-pre-line text-white">
                {data.headline}
              </div>
            </section>
          </div>

          <section className="flex flex-col gap-2">
            <h5 className="h3-bold">지금 바로 바꿔보세요</h5>
            {data.action && (
              <ul className="flex flex-col gap-2">
                <li className="bg-grey1 grid grid-cols-[1fr] items-center gap-5 rounded-2xl px-5 py-5">
                  <div className="flex flex-col gap-1 text-wrap break-keep whitespace-pre-line">
                    <h5 className="p1-bold text-font-basic">
                      {data.action.title}
                    </h5>
                    <h6 className="p2-bold text-main flex items-start gap-1">
                      <ArrowBigRight size={20} fill="currentColor" />
                      {data.action.metric}
                    </h6>
                    <p className="p2-regular text-font-middle">
                      {data.action.details}
                    </p>
                  </div>
                </li>
              </ul>
            )}
          </section>

          <div
            data-capture-ignore
            className="flex w-full max-w-(--max-width) justify-center px-5"
          >
            <Button variant="btnPurple" size="full" onClick={handleSaveImage}>
              이미지 저장하기
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
