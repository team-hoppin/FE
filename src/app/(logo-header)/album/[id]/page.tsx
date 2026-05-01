import AlbumDetail from "@/components/album/album-detail";
import AlbumActionButton from "@/components/album/album-action-button";
import { cookies } from "next/headers";
import { getMusicPromotion } from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AlbumDetailPage({ params }: Props) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("accessToken");

  const { id } = await params;
  const promotionId = Number(id);

  const data = await getMusicPromotion(promotionId);

  const albumInfo = {
    coverUrl: data.imageUrl,
    title: data.songTitle,
    artist: data.activityName,
    releaseDate: data.releaseDate,
    message: data.shortDescription,
    streamingLinks: data.streamingLinks
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((link) => {
        const code = getStreamingCode(link.url);
        if (!code) return null;

        return {
          code,
          url: link.clickUrl,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null),
  };

  return (
    <main className="mt-4 flex flex-col justify-center gap-10">
      <AlbumDetail {...albumInfo} />

      <div className="flex flex-col items-center gap-1">
        {isLoggedIn ? (
          <>
            <span className="c1-medium text-font-light">
              팬들이 링크를 눌렀을 때 이렇게 보여요
            </span>
            <span className="p2-bold text-font-middle mb-2">
              마음에 들면 인스타그램 프로필에 바로 붙여보세요!
            </span>
          </>
        ) : (
          <>
            <span className="c1-medium text-font-light">
              이 노래가 마음에 든다면?
            </span>
            <span className="p2-bold text-font-middle mb-2">
              함께 듣고 싶은 사람에게 공유하세요
            </span>
          </>
        )}
        <AlbumActionButton
          url={data.trackingUrl}
          promotionId={promotionId}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </main>
  );
}
