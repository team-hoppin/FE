import { LinkIcon, CirclePlayIcon } from "lucide-react";
import { GetAnalysisPageRes } from "@/types/api-response";

interface Props {
  realtimeStats: GetAnalysisPageRes["realtimeStats"];
}

export default function RealtimeStatusSection({ realtimeStats }: Props) {
  return (
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
              {realtimeStats.trackingClickCount}
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
              {realtimeStats.streamingClickCount}
            </span>
            <span className="p1-bold text-main-mid self-end">회</span>
          </div>
        </li>
      </ul>
    </section>
  );
}
