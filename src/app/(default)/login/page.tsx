import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import LoginErrorToast from "@/components/login/login-error-toast";
import { EXTERNAL_LINKS } from "@/utils/external-links";
import FadeMotion from "@/components/common/fade-motion";

const BASE_URL = "https://api.musicpeak.site/oauth2/authorization";

export default function Login() {
  return (
    <FadeMotion>
      <main className="p-5">
        <Suspense>
          <LoginErrorToast />
        </Suspense>
        <div className="mt-25 mb-24 flex flex-col items-center gap-3 text-center">
          <Image
            src={"/character/page-login.png"}
            alt="윙크하는 피스"
            width={220}
            height={174}
          />
          <div className="flex flex-col gap-3">
            <h1 className="h2-bold">로그인하고 시작해보세요</h1>
            <p className="text-font-light p2-semibold">
              음악에 더 집중할 시간을 드릴게요.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Button
              asChild
              variant="btnWhite"
              size="full"
              className="relative text-[#000000]"
            >
              <a href={`${BASE_URL}/google`}>
                <span className="absolute top-1/2 left-5 -translate-y-1/2">
                  <Image
                    src={"/brand-logo/google.png"}
                    alt="Google Logo"
                    width={44}
                    height={44}
                  />
                </span>
                구글로 시작하기
              </a>
            </Button>
            <Button
              asChild
              variant="btnWhite"
              size="full"
              className="relative border-none bg-[#FFE812] text-[#000000]"
            >
              <a href={`${BASE_URL}/kakao`}>
                <span className="absolute top-1/2 left-5 -translate-y-1/2">
                  <Image
                    src={"/brand-logo/kakao.png"}
                    alt="Kakao Logo"
                    width={44}
                    height={44}
                  />
                </span>
                카카오로 시작하기
              </a>
            </Button>
            <Button
              asChild
              variant="btnWhite"
              size="full"
              className="text-font-white relative border-none bg-[#03CF5D]"
            >
              <a href={`${BASE_URL}/naver`}>
                <span className="absolute top-1/2 left-5 -translate-y-1/2">
                  <Image
                    src={"/brand-logo/naver.png"}
                    alt="Naver Logo"
                    width={40}
                    height={40}
                  />
                </span>
                네이버로 시작하기
              </a>
            </Button>
          </div>
          <p className="text-font-light c1-medium text-center">
            소셜 로그인 가입 시 본{" "}
            <a
              href={EXTERNAL_LINKS.TERMS}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              서비스이용약관
            </a>{" "}
            및{" "}
            <a
              href={EXTERNAL_LINKS.PRIVACY}
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              개인정보처리방침
            </a>
            에 <br />
            동의하시는 것으로 간주됩니다.
          </p>
        </div>
      </main>
    </FadeMotion>
  );
}
