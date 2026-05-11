"use client";

import Image from "next/image";
import Link from "next/link";
import HomeButtons from "@/components/home/home-buttons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDiagnosisUnreadExists } from "@/lib/api/music-promotion";
import { useOpenAlertModal } from "@/stores/alert-modal-store";

interface Props {
  showIntro: boolean;
}

export default function ClientHome({ showIntro }: Props) {
  const router = useRouter();
  const openAlertModal = useOpenAlertModal();

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const hasUnreadDiagnosis = await getDiagnosisUnreadExists();

        if (!hasUnreadDiagnosis) return;

        openAlertModal({
          variant: "mail-success",
          type: "confirm",
          message: "진단 결과가 도착했어요! 📩",
          description: "내 앨범 홍보가 잘 되고 있는지 지금 확인해보세요",
          onAction: () => {
            router.push("/mypage");
          },
        });
      } catch (e) {
        console.error(e);
      }
    };

    fetchUnread();
  }, [openAlertModal, router]);

  return (
    <main className="flex flex-col justify-between px-5 pt-32.5 pb-21">
      {/* <div className="mb-24 flex flex-col items-center gap-8 text-center">
      </div> */}
      <div className="mb-24 flex flex-col items-center gap-3 text-center">
        <Image
          src="/character/page-main.png"
          alt="신나는 피스"
          width={160}
          height={126}
        />
        <h1 className="h1-bold">
          신곡 홍보,
          <br />
          <span className="text-main">이제 쉽게</span>
          <br />할 수 있어요
        </h1>
        <p className="text-font-middle p2-regular">
          뭘 해야 할지 몰라서 답답했다면
          <br />
          PEAK가 딱 맞는 방법을 알려드릴게요
        </p>
      </div>
      <div className="flex flex-col items-center gap-10">
        <HomeButtons showIntro={showIntro} />
        <div className="c1-medium text-font-light flex flex-col gap-1 text-center">
          내 진단 결과를 한눈에 보고 싶다면?
          <Link href="/mypage" className="text-main c1-bold underline">
            마이페이지로 이동
          </Link>
        </div>
      </div>
    </main>
  );
}
