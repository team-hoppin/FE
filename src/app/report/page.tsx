import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Report() {
  return (
    <main className="p-5">
      <div className="mt-25 mb-24 flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-26">
          <h1 className="h1-bold">
            서비스 준비 중입니다
            <br />
            <span className="text-main">오픈되면 알려드릴게요!</span>
          </h1>
          <div className="flex flex-col items-center gap-6">
            <div className="bg-grey2 h-37 w-37 rounded-full">
              <Image
                src={"/bamti-dancing.svg"}
                alt="밤티"
                width={148}
                height={148}
              />
            </div>
            <p className="text-font-middle p1-semibold">
              더 꼼꼼하고 정확한 진단을 위해
              <br />
              열심히 준비하고 있어요.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-font-light c1-medium text-center">
          아직 홍보 페이지를 만들지 않았다면?
        </p>
        <Button variant="btnPurple" size="full" asChild>
          <Link href="/album">신곡 홍보 링크 만들기</Link>
        </Button>
        <Button variant="btnWhite" size="full" asChild>
          <Link href="/mypage">마이페이지에서 링크 확인하기</Link>
        </Button>
      </div>
    </main>
  );
}
