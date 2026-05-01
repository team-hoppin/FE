import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginErrorToast from "@/components/login/login-error-toast";

const BASE_URL = "https://api.musicpeak.site/oauth2/authorization";

export default function Login() {
  return (
    <main className="p-5">
      <Suspense>
        <LoginErrorToast />
      </Suspense>
      <div className="mt-25 mb-24 flex flex-col items-center gap-8 text-center">
        <div className="bg-grey2 flex h-44 w-44 items-center justify-center rounded-full">
          <Image src={"/bamti.svg"} alt="Logo" width={128} height={128} />
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="h1-bold">로그인하고 시작해보세요</h1>
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
