import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StreamingButton from "@/components/album/streaming-button";
import Image from "next/image";

export default function AlbumDetailPage() {
  return (
    <main className="mt-4 flex flex-col justify-center gap-10">
      <section className="flex flex-col gap-9">
        <div className="flex flex-col items-center gap-1">
          <div className="mb-2 overflow-hidden rounded-2xl">
            <Image
              src="/test-cover.png"
              alt="앨범 커버 이미지"
              width={200}
              height={200}
              className="object-cover"
              priority
            />
          </div>
          <h2 className="h2-bold text-font-basic">피크와 함께라면</h2>
          <p className="p1-bold text-font-basic">김피크</p>
          <p className="p2-medium text-font-middle">2026.01.01</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="p1-bold text-font-middle">음원 들으러 가기</p>
          <div className="grid grid-cols-2 gap-2">
            <StreamingButton streamingCode="spotify" />
            <StreamingButton streamingCode="youtube" />
            <StreamingButton streamingCode="soundcloud" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="p1-bold text-font-middle">김피크의 한 마디</p>
          <Card>
            <CardContent>
              난 지금 미쳐가고 있다.
              <br />이 헤드폰에 내 모든 몸과 영혼을 맡겼다.
              <br />
              음악만이 나라에서 허락하는 유일한 마약이니까.
              <br />
              이게 바로 지금의 나다.
            </CardContent>
          </Card>
        </div>
      </section>

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
