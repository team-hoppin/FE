import { Button } from "@/components/ui/button";
import Image from "next/image";
import ErrorView from "@/components/common/error-view";
import Link from "next/link";

const BASE_URL = "https://api.musicpeak.site/oauth2/authorization";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (error) {
    return (
      <main className="p-5">
        <ErrorView
          title="로그인에 실패했어요"
          description="다시 시도해주세요"
        />
        <div className="fixed right-0 bottom-30 left-0 mx-auto max-w-(--max-width) px-11">
          <Button asChild variant="btnPurple" size="full">
            <Link href="/">메인으로 이동</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5">
      <div className="mt-25 mb-24 flex flex-col items-center gap-8 text-center">
        <div className="bg-grey2 flex h-44 w-44 items-center justify-center rounded-full">
          <Image src={"/bamti.svg"} alt="Logo" width={128} height={128} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="h1-bold">이제 시작해볼까요?</h1>
          <p className="text-font-middle p2-regular">
            음악에 더 집중할 시간을 드릴게요.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button
          asChild
          variant="btnWhite"
          size="full"
          className="text-[#000000]"
        >
          <a href={`${BASE_URL}/google`}>
            <Image
              src={"/google.png"}
              alt="Google Logo"
              width={30}
              height={30}
            />
            구글로 시작하기
          </a>
        </Button>
        <Button
          asChild
          variant="btnWhite"
          size="full"
          className="border-none bg-[#FFE812] text-[#000000]"
        >
          <a href={`${BASE_URL}/kakao`}>
            <Image src={"/kakao.png"} alt="Kakao Logo" width={30} height={30} />
            카카오로 시작하기
          </a>
        </Button>
        <Button
          asChild
          variant="btnWhite"
          size="full"
          className="border-none bg-[#03CF5D] text-[#ffffff]"
        >
          <a href={`${BASE_URL}/naver`}>
            <Image src={"/naver.png"} alt="Naver Logo" width={30} height={30} />
            네이버로 시작하기
          </a>
        </Button>
      </div>
    </main>
  );
}
