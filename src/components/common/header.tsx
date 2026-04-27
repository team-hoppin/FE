import CircleUserRound from "@/components/ui/circle-user-round";
import Image from "next/image";

export default function Header() {
  return (
    <div className="sticky top-0 z-999 flex h-14 w-full items-center justify-between bg-white">
      <div className="h3-bold text-main">
        <Image src={"/logo.svg"} alt="Logo" width={56} height={14} />
      </div>
      <div>
        <CircleUserRound size={24} />
      </div>
    </div>
  );
}
