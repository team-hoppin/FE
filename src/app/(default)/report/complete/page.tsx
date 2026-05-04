import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Complete() {
  return (
    <main className="flex h-fit flex-col justify-between gap-16">
      <div className="mt-7 flex flex-col gap-1">
        <h4 className="h3-bold text-font-basic">진단 신청 완료!</h4>
        <p className="p2-regular text-font-middle">
          평균 1~2일 이내 결과를 확인하실 수 있어요
          <br />
          메일로 알려드릴게요
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <p className="c1-bold text-main mt-3">Tip! 이렇게 해보세요</p>
        <ul className="flex flex-col gap-2">
          <li className="bg-grey1 grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl px-5 py-5">
            <div className="num bg-font-middle c1-bold flex h-6 w-6 items-center justify-center rounded-full text-white">
              1
            </div>
            <div className="text-wrap">
              <p className="p2-regular text-font-middle">
                진단은 발매일+1일/+3일/+5일 텀으로
                <br />
                홍보를 진행하면서 확인하면 좋아요
              </p>
            </div>
          </li>

          <li className="bg-grey1 grid grid-cols-[auto_1fr] items-center gap-5 rounded-2xl px-5 py-5">
            <div className="num bg-font-middle c1-bold flex h-6 w-6 items-center justify-center rounded-full text-white">
              2
            </div>
            <div className="text-wrap">
              <p className="p2-regular text-font-middle">
                이전 진단에서 발견한 취약부분을 개선에
                <br />
                반영했다면 훨씬 효과적인 홍보가 될 거예요
              </p>
            </div>
          </li>
        </ul>
      </section>

      <div className="fixed right-1/2 bottom-15 flex w-full max-w-(--max-width) translate-x-1/2 justify-center px-5">
        <Button variant="btnPurple" size="full" asChild>
          <Link href={"/"}>이전 진단 내역 보기</Link>
        </Button>
      </div>
    </main>
  );
}
