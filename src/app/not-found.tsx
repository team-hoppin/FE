import ErrorView from "@/components/common/error-view";
import HeaderClient from "@/components/common/header-client";
import FadeMotion from "@/components/common/fade-motion";

export default function NotFound() {
  return (
    <FadeMotion>
    <main className="flex min-h-[calc(100dvh-var(--header-height))] flex-col">
      <HeaderClient />
      <ErrorView
        title={`요청하신 화면을\n불러오지 못했어요`}
        description={`페이지가 없거나 연결이 잠시 불안정해요.\n잠시 후 다시 시도해주세요.`}
      />
    </main>
    </FadeMotion>
  );
}
