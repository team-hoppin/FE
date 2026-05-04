import { ChevronLeftIcon } from "lucide-react";

export default function SettingPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="text-font-middle relative flex items-center">
        <button>
          <ChevronLeftIcon size={32} />
        </button>
        <h3 className="h3-bold absolute left-1/2 -translate-x-1/2">설정</h3>
      </header>

      <section className="mb-6 flex flex-col gap-2">
        <p className="p2-semibold text-font-light">계정 정보</p>

        <div className="border-grey1 -mx-5 flex items-center justify-between border-y px-5">
          <div className="flex items-center gap-3 py-6">
            <div className="bg-grey1 h-8 w-8 rounded-full"></div>
            <span className="p2-semibold text-font-basic">
              csmusicpeak@gmail.com
            </span>
          </div>

          <button className="p2-semibold text-font-light cursor-pointer">
            로그아웃
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <p className="p2-semibold text-font-light">앱 정보</p>

        <div className="p2-medium text-font-basic">
          <div className="flex items-center justify-between py-2">
            <span>버전 정보</span>
            <span className="text-font-light">v1.0.0</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span>이용문의</span>
            <span className="text-font-light">csmusicpeak@gmail.com</span>
          </div>

          <button className="flex w-full cursor-pointer items-center justify-between py-2">
            <span>이용약관</span>
          </button>

          <button className="flex w-full cursor-pointer items-center justify-between py-2">
            <span>개인정보처리방침</span>
          </button>
        </div>
      </section>

      <button className="p2-semibold text-font-middle cursor-pointer self-start">
        회원탈퇴
      </button>
    </div>
  );
}
