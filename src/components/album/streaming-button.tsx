import Image from "next/image";
import { mapToStreamingBtn } from "@/utils/mapper";
import { StreamingCode } from "@/types/album";

interface Props {
  streamingCode: StreamingCode;
}

export default function StreamingButton({ streamingCode }: Props) {
  const { label, icon } = mapToStreamingBtn[streamingCode];

  return (
    <button
      className="bg-grey1 flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl px-4"
      type="button"
    >
      <Image src={icon} alt={label} width={32} height={32} />
      <span className="p2-bold text-font-middle">{label}</span>
    </button>
  );
}
