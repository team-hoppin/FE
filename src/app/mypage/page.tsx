"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
const BASE_URL = "https://api.musicpeak.site";

export default function MyPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
    router.refresh();
  };

  const handleWithdraw = async () => {
    await fetch(`${BASE_URL}/api/me/delete`, {
      method: "DELETE",
      credentials: "include",
    });
    window.location.href = "/login";
  };

  return (
    <main className="flex flex-col gap-6 px-5 pt-10">
      <>card component 자리</>
      {/* 네이버검수용 프로필 나중에 지워도됨 
      <div className="bg-grey1 flex items-center gap-4 rounded-2xl px-5 py-4">
        <div className="bg-grey2 flex h-14 w-14 items-center justify-center rounded-full">
          <span className="h3-bold text-font-middle">김</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="p1-bold text-font-basic">김진성</p>
          <p className="p2-regular text-font-middle">FEAK</p>
          <p className="c1-medium text-font-light">viviammm@naver.com</p>
        </div>
      </div> */}
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
