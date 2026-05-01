import { Button } from "@/components/ui/button";
import AlbumDetail from "@/components/album/album-detail";

const MOCK_ALBUM = {
  coverUrl: "/test-cover.png",
  title: "피크와 함께라면",
  artist: "김피크",
  releaseDate: "2026.01.01",
  streamingCodes: ["spotify", "youtube", "soundcloud"] as const,
  message:
    "난 지금 미쳐가고 있다.\n이 헤드폰에 내 모든 몸과 영혼을 맡겼다.\n음악만이 나라에서 허락하는 유일한 마약이니까.\n이게 바로 지금의 나다.",
};

export default function AlbumDetailPage() {
  return (
    <main className="my-7 flex flex-col justify-center gap-10">
      <AlbumDetail {...MOCK_ALBUM} />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="c1-medium text-font-light">
            팬들이 링크를 눌렀을 때 이렇게 보여요.
          </span>
          <span className="p2-bold text-font-middle">
            마음에 들면 인스타그램 프로필에 바로 붙여보세요!
          </span>
        </div>
        <Button variant="btnPurple" size="md">
          🔗 링크 복사
        </Button>
        <Button variant="btnPurpleSub" size="md">
          수정하기
        </Button>
      </div>
    </main>
  );
}
