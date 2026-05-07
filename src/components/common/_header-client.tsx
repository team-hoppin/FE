"use client";

import CircleUserRound from "@/components/ui/circle-user-round";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  isLoggedIn: boolean;
}

export default function HeaderClient({ isLoggedIn }: Props) {
  const pathname = usePathname();

  const isMyPage = pathname === "/mypage";
  const isSettingPage = pathname === "/setting";

  return (
    <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white">
      <Link href="/">
        <Image src="/logo.svg" alt="Logo" width={56} height={14} />
      </Link>

      {isLoggedIn && !isSettingPage && (
        <Link href={isMyPage ? "/setting" : "/mypage"}>
          {isMyPage ? (
            <SettingsIcon size={24} className="text-font-light" />
          ) : (
            <CircleUserRound size={24} />
          )}
        </Link>
      )}
    </div>
  );
}
