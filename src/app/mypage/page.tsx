"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { toast } from "sonner";
import AlbumCarousel, { AlbumData } from "@/components/mypage/album-carousel";
import {
  getMyPagePromotions,
  getMusicPromotion,
  deleteMusicPromotion,
} from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";
import { Spinner } from "@/components/ui/spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import ErrorView from "@/components/common/error-view";

const BASE_URL = "https://api.musicpeak.site";

async function fetchAlbums(): Promise<AlbumData[]> {
  const { promotions } = await getMyPagePromotions();
  const details = await Promise.all(
    [...promotions]
      .sort((a, b) => b.promotionId - a.promotionId)
      .map((p) => getMusicPromotion(p.promotionId))
  );

  return details.map((data) => ({
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
}

export default function MyPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const {
    data: albums = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<AlbumData[]>({
    queryKey: ["myPageAlbums"],
    queryFn: fetchAlbums,
  });

  const selectedAlbum =
    albums.find((a) => a.id === selectedAlbumId) ?? albums[0] ?? null;

  const handleSelect = useCallback((album: AlbumData) => {
    setSelectedAlbumId(album.id);
  }, []);

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
    router.refresh();
  };

  const handleDeleteAlbum = (album: AlbumData) => {
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
      onAction: async () => {
        try {
          await deleteMusicPromotion(Number(album.id));
          queryClient.setQueryData<AlbumData[]>(["myPageAlbums"], (prev = []) =>
            prev.filter((a) => a.id !== album.id)
          );
          setSelectedAlbumId(null);
        } catch {
          toast.error("삭제에 실패했어요. 잠시 후 다시 시도해 주세요.");
        }
      },
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
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="text-main" />
        </div>
      ) : isError ? (
        <>
          <ErrorView
            title={`죄송합니다\n데이터를 불러오지 못했어요.`}
            description={`연결이 잠시 불안정해요.\n다시 시도해 주세요.`}
          />
          <div className="fixed right-0 bottom-30 left-0 mx-auto max-w-(--max-width) px-11">
            <Button variant="btnPurple" size="full" onClick={() => refetch()}>
              다시 시도
            </Button>
          </div>
        </>
      ) : albums.length > 0 ? (
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
                selectedAlbum && router.push(`/album?edit=${selectedAlbum.id}`)
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

      {!isError && (
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
      )}
    </main>
  );
}
