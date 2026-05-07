"use client";

import { toast } from "sonner";
import { ChevronLeftIcon, ExternalLinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useOpenAlertModal } from "@/stores/alert-modal-store";
import { getMe, logout, withdraw } from "@/lib/api/auth";
import { mapToAuthProvider } from "@/utils/mapper";
import { GetMeRes } from "@/types/api-response";

const EXTERNAL_LINKS = {
  TERMS:
    "https://www.notion.so/goormkdx/PEAK-34bc0ff4ce318055b56de402af767268?source=copy_link",
  PRIVACY:
    "https://www.notion.so/goormkdx/PEAK-356c0ff4ce31806dbf70c98b5942486c?source=copy_link",
};

export default function SettingPage() {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

  const [me, setMe] = useState<GetMeRes | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const data = await getMe();
        setMe(data);
      } catch {
        toast.error("사용자 정보를 불러오지 못했어요.");
      }
    };

    fetchMe();
  }, []);

  const providerInfo = me ? mapToAuthProvider[me.provider] : null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
      router.refresh();
    } catch {
      toast.error("로그아웃에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleWithdraw = () => {
    openAlertModal({
      type: "confirm",
      message: (
        <>
          탈퇴 시{" "}
          <span className="p2-semibold">
            현재 사용 중인 모든 링크와 정보가 사라지고
          </span>
          {"\n"}
          이후{" "}
          <span className="p2-semibold">
            3개월간 동일 계정으로 재가입이 불가
          </span>
          해요.{"\n"}
          정말 탈퇴하시겠어요?
        </>
      ),
      onAction: async () => {
        try {
          await withdraw();
          document.cookie = "onboarding=; path=/; max-age=0";
          router.replace("/onboarding");
          router.refresh();
        } catch {
          toast.error("회원탈퇴에 실패했어요. 잠시 후 다시 시도해 주세요.");
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="text-font-middle relative flex items-center">
        <button className="cursor-pointer" onClick={() => router.back()}>
          <ChevronLeftIcon size={32} />
        </button>
        <h3 className="h3-bold absolute left-1/2 -translate-x-1/2">설정</h3>
      </header>

      <section className="mb-6 flex flex-col gap-2">
        <p className="p2-semibold text-font-light">계정 정보</p>

        <div className="border-grey1 -mx-5 flex items-center justify-between border-y px-5">
          <div className="flex items-center gap-3 py-6">
            {providerInfo && (
              <Image
                src={providerInfo.icon}
                alt={providerInfo.label}
                width={32}
                height={32}
              />
            )}
            <span className="p2-semibold text-font-basic">
              {me?.email ?? "-"}
            </span>
          </div>

          <button
            className="p2-semibold text-font-light cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <p className="p2-semibold text-font-light">앱 정보</p>

        <ul className="p2-medium text-font-basic">
          <li className="flex items-center justify-between py-2">
            <span>버전 정보</span>
            <span className="text-font-light">v1.0.0</span>
          </li>

          <li className="flex items-center justify-between py-2">
            <span>이용문의</span>
            <span className="text-font-light">csmusicpeak@gmail.com</span>
          </li>

          <li>
            <Link
              href={EXTERNAL_LINKS.TERMS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between py-2"
            >
              <span>이용약관</span>
              <ExternalLinkIcon size={16} className="text-font-light" />
            </Link>
          </li>

          <li>
            <Link
              href={EXTERNAL_LINKS.PRIVACY}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between py-2"
            >
              <span>개인정보처리방침</span>
              <ExternalLinkIcon size={16} className="text-font-light" />
            </Link>
          </li>
        </ul>
      </section>

      <button
        className="p2-semibold text-font-middle cursor-pointer self-start"
        onClick={handleWithdraw}
      >
        회원탈퇴
      </button>
    </div>
  );
}
