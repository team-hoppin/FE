import FadeMotion from "@/components/common/fade-motion";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/back-button";
import Image from "next/image";
import Link from "next/link";
import ErrorView from "@/components/common/error-view";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function Promote({ searchParams }: Props) {
  const { id } = await searchParams;

  if (!id)
    return (
      <ErrorView
        title={`요청하신 화면을\n불러오지 못했어요`}
        description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
      />
    );

  return (
    <FadeMotion x={20}>
      <main className="flex min-h-[calc(100dvh-var(--header-height)-var(--page-padding-bottom))] flex-col">
        <BackButton href={`/album/${id}`} />
        <div className="mb-6 flex flex-col gap-16">
          <div className="mt-7 flex flex-col gap-1">
            <h4 className="h3-bold text-font-basic">홍보 링크 복사 완료!</h4>
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
                  <h5 className="p2-bold text-font-basic">
                    홍보 페이지의 링크를 복사하기
                  </h5>
                  <p className="p2-regular text-font-middle">
                    {/* 페이지 하단의 &apos;링크 복사&apos; 버튼을 누르세요 */}
                    현재 복사되어 있는 상태예요
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
                    인스타그램 바이오란에 넣으면 끝!
                  </p>
                </div>
              </li>
            </ul>

            <div className="bg-grey1 flex flex-col gap-4 rounded-2xl px-13 pt-6">
              <Image
                src="/ex-insta.png"
                alt="인스타그램 프로필 예시"
                width={456}
                height={348}
                className="h-auto w-full"
              />
            </div>
          </section>
        </div>
        <div className="mt-auto flex flex-col gap-4 px-6">
          <Button variant="btnPurple" size="full" asChild>
            <Link href={"/mypage"}>마이페이지로 이동하기</Link>
          </Button>
        </div>
      </main>
    </FadeMotion>
  );
}
