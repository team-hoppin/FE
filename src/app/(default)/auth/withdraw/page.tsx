import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function WithdrawPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-around text-center">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-center">
          <Image
            src="/character-withdraw.png"
            alt="회원탈퇴 캐릭터"
            width={220}
            height={170}
          />
        </div>
        <div>
          <h1 className="h1-bold text-font-basic">탈퇴 처리되었습니다</h1>
          <h1 className="h1-bold text-main">언제든 다시 찾아주세요!</h1>
          <p className="p2-semibold text-font-light mt-3">
            더 나은 서비스 제공을 위해 노력하겠습니다.
            <br />
            이용해 주셔서 감사합니다.
          </p>
        </div>
      </div>
      <Button asChild variant="btnPurple" size="full">
        <Link href="/onboarding">메인홈으로 나가기</Link>
      </Button>
    </main>
  );
}
