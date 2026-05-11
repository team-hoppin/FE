import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function WithdrawPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-5 pt-32.5 pb-21 text-center">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image
          src="/character/page-withdraw.png"
          alt="울보 피스"
          width={220}
          height={173}
        />
        <h1 className="h1-bold text-font-basic">
          탈퇴 처리되었습니다
          <br />
          <span className="text-main">언제든 다시 찾아주세요!</span>
        </h1>
        <p className="p2-semibold text-font-light">
          더 나은 서비스 제공을 위해 노력하겠습니다.
          <br />
          이용해 주셔서 감사합니다.
        </p>
      </div>
      <Button asChild variant="btnPurple" size="full">
        <Link href="/onboarding">메인홈으로 나가기</Link>
      </Button>
    </main>
  );
}
