import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { getStreamingCode } from "@/utils/album";
import { mapToStreamingBtn } from "@/utils/mapper";
import { GetAnalysisPageRes } from "@/types/api-response";

interface Props {
  streamingLinks: GetAnalysisPageRes["streamingLinks"];
}

export default function StreamingSection({ streamingLinks }: Props) {
  return (
    <section className="mb-1 flex flex-col gap-6">
      <h4 className="h4-bold text-font-basic">
        어떤 스트리밍 사이트로 이동했나요?
      </h4>

      <ul className="flex flex-col gap-5">
        {streamingLinks.map((item) => {
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
                  {Math.round(item.clickShareRate)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
