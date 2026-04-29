"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useOpenAlertModal } from "@/stores/alert-modal-store";

const BASE_URL = "https://api.musicpeak.site";

export default function MyPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();
  // TODO: API 연결 시 실제 데이터로 교체
  const hasAlbums = true;

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.replace("/login");
  };

  const handleWithdraw = () => {
    openAlertModal({
      type: "confirm",
      message: "정말 탈퇴하시겠어요?\n탈퇴 후 90일간 재가입이 불가합니다.",
      onAction: async () => {
        await fetch(`${BASE_URL}/api/me/delete`, {
          method: "DELETE",
          credentials: "include",
        });
        router.replace("/login");
      },
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-10">
      {hasAlbums ? (
        <>미리보기 컴포넌트 자리</>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <p className="p2-medium text-font-middle">
            현재 만들어진 홍보 페이지가 없어요
          </p>
          <Button variant="btnPurple" size="full" asChild>
            <Link href="/album">신곡 홍보 링크 만들기</Link>
          </Button>
        </div>
      )}

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
