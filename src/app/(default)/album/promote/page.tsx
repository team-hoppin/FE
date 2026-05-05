import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Promote() {
  return (
    <main className="flex flex-col gap-16">
      <div className="mt-7 flex flex-col gap-1">
        <h4 className="h3-bold text-font-basic">링크 복사 완료!</h4>
        <p className="p2-regular text-font-middle">
          이제 인스타 프로필에 링크를 붙여두세요.
          <br />
          발매일로부터 14일, 이 기간이 제일 중요해요.
        </p>
        <p className="c1-bold text-main mt-3">
          Tip! 인스타 프로필 외에도 다양한 곳에 공유할 수 있어요
        </p>
      </div>

      <section className="flex flex-col gap-2">
        <ul className="bg-grey1 flex flex-col gap-4 rounded-2xl px-5 py-5">
          <li className="grid grid-cols-[auto_1fr] items-center gap-5">
            <div className="num bg-font-middle c1-bold flex h-6 w-6 items-center justify-center rounded-full text-white">
              1
            </div>
            <div className="text-wrap">
              <h5 className="p2-bold text-font-basic">Peak 링크 복사하기</h5>
              <p className="p2-regular text-font-middle">
                아래 &apos;링크 복사&apos; 버튼을 누르세요
              </p>
            </div>
          </li>
          <li className="grid grid-cols-[auto_1fr] items-center gap-5">
            <div className="num bg-font-middle c1-bold flex h-6 w-6 items-center justify-center rounded-full text-white">
              2
            </div>
            <div className="text-wrap">
              <h5 className="p2-bold text-font-basic">
                인스타 프로필 링크에 붙여넣기
              </h5>
              <p className="p2-regular text-font-middle">
                바이오 링크 자리에 넣으면 끝!
              </p>
            </div>
          </li>
        </ul>

        <div className="bg-grey1 flex flex-col gap-4 rounded-2xl px-8 pt-5">
          <Image
            src="/ex-insta.png"
            alt="인스타그램 프로필 예시"
            width={572}
            height={380}
          />
        </div>
      </section>

      <div className="flex flex-col gap-4 px-6">
        <Button variant="btnPurple" size="full" asChild>
          <Link href={"/mypage"}>마이페이지로 이동</Link>
        </Button>
        <div className="flex flex-col gap-1 text-center">
          <p className="text-font-light c1-medium cursor-pointer">
            이미 게시물을 올렸다면?
          </p>
          <Link
            href={"/report/coming-soon"}
            className="text-main cursor-pointer text-xs font-bold underline"
          >
            내 홍보 콘텐츠 진단하기
          </Link>
        </div>
      </div>
    </main>
  );
}
