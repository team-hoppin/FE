"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const BASE_URL = "https://api.musicpeak.site";

export default function MyPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.replace("/login");
  };

  const handleWithdraw = async () => {
    await fetch(`${BASE_URL}/api/me/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    router.replace("/login");
  };

  return (
    <main className="flex flex-col gap-6 px-5 pt-10">
      <>card component</>
      <div className="flex flex-col gap-2 px-6">
        <Button variant="btnPurple" size="full">
          🔗 링크 복사하기
        </Button>
        <Button variant="btnWhite" size="full">
          수정하기
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <button
          className="p2-semibold text-font-middle cursor-pointer px-4 py-3"
          onClick={handleWithdraw}
        >
          회원탈퇴
        </button>
        <div className="flex h-6 w-6 items-center justify-center">
          <span className="bg-border h-4 w-px"></span>
        </div>
        <button
          className="p2-semibold text-font-middle cursor-pointer px-4 py-3"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </main>
  );
}
