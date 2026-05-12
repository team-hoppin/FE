import { Card } from "@/components/ui/card";
import DiagnosisLabel from "@/components/mypage/diagnosis-label";
import { CalendarIcon, ChevronRightIcon } from "lucide-react";
import { AnalysisStatus } from "@/types/album";

interface Props {
  status: AnalysisStatus;
  diagnosedDate: string;
  bottleneckType: string | null;
  actionTitle: string;
  headline: string;
}

export default function DiagnosisItemCard({
  status,
  diagnosedDate,
  bottleneckType,
  actionTitle,
  headline,
}: Props) {
  const isAnalyzing = status === "RUNNING"; // 진단중
  const isAnalyzed = status === "COMPLETED"; // 진단완료

  const title = isAnalyzing ? "진단 결과 대기중이에요" : actionTitle;

  const description = isAnalyzing
    ? "평균 1~2일 이내 결과를 확인하실 수 있어요. 메일로 알려드릴게요."
    : headline;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-font-light flex items-center gap-1">
        <CalendarIcon size={12} />
        <span className="p2-bold">{diagnosedDate}</span>
      </div>

      <div className="cursor-pointer">
        <Card className="border-grey1 rounded-r2 relative p-5">
          {isAnalyzed && (
            <div className="text-font-light absolute top-5 right-5 flex items-center gap-0.5">
              <span className="c1-bold">더보기</span>
              <ChevronRightIcon size={16} />
            </div>
          )}

          <div className="flex flex-col gap-3">
            {isAnalyzed && <DiagnosisLabel label={bottleneckType} />}

            <div className="flex flex-col gap-1">
              <p className="p1-bold text-font-middle">{title}</p>
              <p className="p2-regular text-font-middle">{description}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
