import AlbumDetail from "@/components/album/album-detail";
import AlbumActionButton from "@/components/album/album-action-button";
import { cookies } from "next/headers";
import { getMe } from "@/lib/api/auth";
import { getMusicPromotion } from "@/lib/api/music-promotion";
import { getStreamingCode } from "@/utils/album";
import FadeMotion from "@/components/common/fade-motion";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}

export default async function AlbumDetailPage({ params, searchParams }: Props) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("accessToken");

  const { id } = await params;
  const { from } = await searchParams;

  const promotionId = Number(id);
  const fromAnalysis = from === "analysis";

  const data = await getMusicPromotion(promotionId);

  let isMusician = false; // 앨범 소유자 여부

  console.log("로그인 여부: " + isLoggedIn);
  console.log("호출 전 (뮤지션)" + data.musicianId);

  // 로그인 되어 있는 유저만 사용자 정보 조회
  if (isLoggedIn) {
    try {
      console.log("로그인 됨: (뮤지션)" + data.musicianId);
      const me = await getMe();
      isMusician = me.id === data.musicianId;
      console.log("호출 후 (사용자)" + me.id);
    } catch {
      isMusician = false;
    }
  }

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
    <FadeMotion>
      <main className="flex min-h-[calc(100dvh-var(--header-height)-var(--page-padding-bottom))] flex-col">
        <div className="mt-4 mb-6 flex flex-col justify-center gap-10">
          <AlbumDetail {...albumInfo} />
        </div>
        <div className="mt-auto flex flex-col items-center gap-1">
          {isMusician ? (
            <>
              <span className="c1-medium text-font-light">
                팬들이 링크를 눌렀을 때 이렇게 보여요.
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
                함께 듣고 싶은 사람에게 공유하세요.
              </span>
            </>
          )}
          <AlbumActionButton
            url={data.trackingUrl}
            promotionId={promotionId}
            isMusician={isMusician}
            fromAnalysis={fromAnalysis}
          />
        </div>
      </main>
    </FadeMotion>
  );
}
