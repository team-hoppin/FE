"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { toast } from "sonner";
import AlbumCarousel, { AlbumData } from "@/components/mypage/album-carousel";

const BASE_URL = "https://api.musicpeak.site";

// TODO: API 연결 시 교체
const MOCK_ALBUMS: AlbumData[] = [
  {
    id: "1",
    coverUrl: "/test-cover.png",
    title: "피크와 함께라면",
    artist: "김피크",
    releaseDate: "2026.01.01",
    streamingCodes: ["spotify", "youtube", "soundcloud"],
    message:
      "난 지금 미쳐가고 있다.\n이 헤드폰에 내 모든 몸과 영혼을 맡겼다.\n음악만이 나라에서 허락하는 유일한 마약이니까.\n이게 바로 지금의 나다.",
    link: "https://www.musicpeak.site/album/1",
  },
  {
    id: "2",
    coverUrl: "/test-cover.png",
    title: "피크와 함께라면",
    artist: "김피크",
    releaseDate: "2026.01.01",
    streamingCodes: ["spotify", "youtube", "soundcloud"],
    message:
      "난 지금 미쳐가고 있다.\n이 헤드폰에 내 모든 몸과 영혼을 맡겼다.\n음악만이 나라에서 허락하는 유일한 마약이니까.\n이게 바로 지금의 나다.",
    link: "https://www.musicpeak.site/album/2",
  },
];

export default function MyPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData>(MOCK_ALBUMS[0]);
  const hasAlbums = MOCK_ALBUMS.length > 0;

  const handleSelect = useCallback((album: AlbumData) => {
    setSelectedAlbum(album);
  }, []);

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
    router.refresh();
  };

  const handleDeleteAlbum = () => {
    openAlertModal({
      type: "confirm",
      message: (
        <>
          페이지 삭제 시{"\n"}
          <span className="p2-semibold">
            기존 링크를 통한 팬 반응 수집이 중지돼요.
          </span>
          {"\n"}
          정말 삭제하시겠어요?
        </>
      ),
      onAction: () => {},
    });
  };

  const handleWithdraw = () => {
    openAlertModal({
      type: "confirm",
      message: (
        <>
          탈퇴 시{" "}
          <span className="p2-semibold">
            현재 사용 중인 모든 링크와 정보가 사라지고
          </span>
          {"\n"}
          이후{" "}
          <span className="p2-semibold">
            3개월간 동일 계정으로 재가입이 불가
          </span>
          해요.{"\n"}
          정말 탈퇴하시겠어요?
        </>
      ),
      onAction: async () => {
        try {
          const res = await fetch(`${BASE_URL}/api/me/delete`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) {
            toast.error("회원탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.");
            return;
          }
          router.replace("/onboarding");
          router.refresh();
        } catch {
          toast.error("네트워크 오류로 회원탈퇴에 실패했어요.");
        }
      },
    });
  };

  return (
    <main className="flex flex-1 flex-col gap-6 px-5 pt-10">
      {/* 네이버검수용 프로필 나중에 지워도됨 */}
      <div className="bg-grey1 flex items-center gap-4 rounded-2xl px-5 py-4">
        <div className="bg-grey2 flex h-14 w-14 items-center justify-center rounded-full">
          <span className="h3-bold text-font-middle">김</span>
        </div>
        <div className="flex flex-col gap-1">
          <p className="p1-bold text-font-basic">김진성</p>
          <p className="p2-regular text-font-middle">FEAK</p>
          <p className="c1-medium text-font-light">viviammm@naver.com</p>
        </div>
      </div>
      {hasAlbums ? (
        <>
          <AlbumCarousel
            albums={MOCK_ALBUMS}
            onSelect={handleSelect}
            onDelete={handleDeleteAlbum}
          />
          <div className="flex flex-col gap-2">
            <Button
              variant="btnPurple"
              size="full"
              onClick={() => navigator.clipboard.writeText(selectedAlbum.link)}
            >
              🔗 링크 복사
            </Button>
            <Button
              variant="btnWhite"
              size="full"
              onClick={() => router.push(`/album/${selectedAlbum.id}`)}
            >
              수정하기
            </Button>
          </div>
        </>
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
