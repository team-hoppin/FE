import CircleUserRound from "@/components/ui/circle-user-round";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("refreshToken");

  return (
    <div className="sticky top-0 z-999 flex h-14 w-full items-center justify-between bg-white">
      <div className="h3-bold text-main">
        <Image src={"/logo.svg"} alt="Logo" width={56} height={14} />
      </div>
      {isLoggedIn && (
        <Link href="/mypage">
          <CircleUserRound size={24} />
        </Link>
      )}
    </div>
  );
}
