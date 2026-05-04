import { cookies } from "next/headers";
import HomeButtons from "@/components/home/home-buttons";
import Image from "next/image";

export default async function Home() {
  const cookieStore = await cookies();

  const showIntro = !cookieStore.has("peak-intro-seen");

  return (
    <main className="p-5">
      <div className="mt-25 mb-24 flex flex-col items-center gap-8 text-center">
        <div className="bg-grey2 h-30 w-30 rounded-full">
          <Image src="/bamti-dancing.svg" alt="밤티" width={120} height={120} />
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="h1-bold">
            신곡 홍보,
            <br />
            <span className="text-main">이제 쉽게</span>
            <br />할 수 있어요
          </h1>
          <p className="text-font-middle p2-regular">
            뭘 해야 할지 몰라서 답답했다면
            <br />
            Peak가 딱 맞는 방법을 알려드릴게요
          </p>
        </div>
      </div>
      <HomeButtons showIntro={showIntro} />
    </main>
  );
}
