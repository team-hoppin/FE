"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { toast } from "sonner";
import AlbumCarousel, { AlbumData } from "@/components/mypage/album-carousel";
import { getMyPagePromotions, getMusicPromotion } from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";

const BASE_URL = "https://api.musicpeak.site";

export default function MyPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();
  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<AlbumData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const { promotions } = await getMyPagePromotions();
        const details = await Promise.all(
          promotions.map((p) => getMusicPromotion(p.promotionId))
        );

        const albumData: AlbumData[] = details.map((data) => ({
          id: String(data.promotionId),
          coverUrl: data.imageUrl,
          title: data.songTitle,
          artist: data.activityName,
          releaseDate: data.releaseDate,
          message: data.shortDescription,
          streamingLinks: data.streamingLinks
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((link) => {
              const code = getStreamingCode(`https://${link.domain}`);
              if (!code) return null;
              return { code, url: link.redirectUrl };
            })
            .filter((v): v is NonNullable<typeof v> => v !== null),
          link: data.trackingUrl,
        }));

        setAlbums(albumData);
        if (albumData.length > 0) setSelectedAlbum(albumData[0]);
      } catch {
        toast.error("앨범 목록을 불러오지 못했어요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlbums();
  }, []);

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
      {isLoading ? null : albums.length > 0 ? (
        <>
          <AlbumCarousel
            albums={albums}
            onSelect={handleSelect}
            onDelete={handleDeleteAlbum}
          />
          <div className="flex flex-col gap-2">
            <Button
              variant="btnPurple"
              size="full"
              onClick={() =>
                selectedAlbum &&
                navigator.clipboard.writeText(selectedAlbum.link)
              }
            >
              🔗 링크 복사
            </Button>
            <Button
              variant="btnWhite"
              size="full"
              onClick={() =>
                selectedAlbum && router.push(`/album/${selectedAlbum.id}`)
              }
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
