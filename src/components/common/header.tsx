import CircleUserRound from "@/components/ui/circle-user-round";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("refreshToken");

  return (
    <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white">
      <Link href="/">
        <Image src={"/logo.svg"} alt="Logo" width={56} height={14} />
      </Link>
      {isLoggedIn && (
        <Link href="/mypage">
          <CircleUserRound size={24} />
        </Link>
      )}
    </div>
  );
}
