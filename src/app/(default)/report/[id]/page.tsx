"use client";

import BackButton from "@/components/common/back-button";
import ErrorView from "@/components/common/error-view";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { ArrowBigRight, Calendar, ChevronRight } from "lucide-react";
import { toJpeg } from "html-to-image";
import { toast } from "sonner";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getAnalysisPage,
  getDiagnosisDetail,
  getMusicPromotion,
} from "@/lib/api/music-promotion";
import { GetDiagnosisDetailRes } from "@/types/api-response";

export default function ReportDetailPage() {
  const { id } = useParams<{ id: string }>();
  const promotionId = Number(id);

  const [data, setData] = useState<GetDiagnosisDetailRes | null>(null);
  const [activityName, setActivityName] = useState<string>("");
  const [diagnosedDate, setDiagnosedDate] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setIsEmpty(false);
    try {
      const [analysisPage, promotion] = await Promise.all([
        getAnalysisPage(promotionId),
        getMusicPromotion(promotionId),
      ]);
      setActivityName(promotion.activityName);
      const cards = analysisPage.diagnosisSection.diagnosisCards;
      if (!cards.length) {
        setIsEmpty(true);
        return;
      }

      // 일단 첫번째카드 diagnosisId로 상세조회 나중에 목록생기면 삭제예정
      setDiagnosedDate(cards[0].diagnosedDate);
      const detail = await getDiagnosisDetail(
        promotionId,
        cards[0].diagnosisId
      );
      setData(detail);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [promotionId]);

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
      const link = document.createElement("a");
      link.download = "report.jpg";
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("이미지 저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  const [from, to] = data?.diagnosis.highlightSection.split(" > ") ?? [];

  const todayLabel = (() => {
    const d = new Date();
    const yy = String(d.getFullYear()).slice(-2);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yy}.${mm}.${dd}`;
  })();

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

  if (isEmpty || !data) return null;

  return (
    <>
      <BackButton href="/report" />
      <main className="flex flex-col gap-9">
        <div className="bg-allwhite flex min-h-screen flex-col gap-9">
          <div className="mt-7 flex flex-col items-start gap-1">
            <h2 className="h2-bold text-font-basic">
              {activityName || "아티스트"}님의 홍보 현황이에요
            </h2>
            <div className="border-border text-font-middle flex items-center gap-2 rounded-full border px-4 py-2">
              <Calendar size={16} />
              <span className="p2-medium">
                {diagnosedDate ? `${diagnosedDate} - ${todayLabel}` : "-"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <section className="grid grid-cols-3 gap-5 text-center">
              {[
                {
                  label: "팔로워 대비 반응률",
                  value: data?.summaryMetrics.followerEngagementRate,
                },
                {
                  label: "반응 대비 홍보 클릭률",
                  value: data?.summaryMetrics.promoClickRateByEngagement,
                },
                {
                  label: "홍보 대비 스트리밍 클릭률",
                  value: data?.summaryMetrics.streamingClickRateByPromoClick,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="box-item rounded-r2 bg-grey1 flex min-h-26 flex-col justify-start gap-2.5 p-2.5"
                >
                  <div className="c1-medium text-font-middle rounded-r1 w-full bg-white py-1 break-keep">
                    {label}
                  </div>
                  <h1 className="text-main text-4xl font-semibold">
                    {value ?? "-"}
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
              <div className="bg-brand-gradient rounded-r2 p-4 break-keep whitespace-pre-line text-white">
                {data?.headline}
              </div>
            </section>
          </div>

          <section className="flex flex-col gap-2">
            <h5 className="h3-bold">지금 바로 바꿔보세요</h5>
            <ul className="flex flex-col gap-2">
              {data?.action && (
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
              )}
            </ul>
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
