import type { Metadata } from "next";
import { pretendard, poppins } from "./fonts/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/common/header";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.musicpeak.site"),
  title: "PEAK",
  description:
    "인스타 게시물부터 스트리밍까지, 어디서 팬이 끊기는지 확인하고 바로 개선하세요.",
  openGraph: {
    type: "website",
    url: "/",
    title: "신곡 홍보했는데 왜 아무도 안 듣지? 싶을 땐 PEAK",
    description:
      "인스타 게시물부터 스트리밍까지, 어디서 팬이 끊기는지 확인하고 바로 개선하세요.",
    siteName: "PEAK",
    locale: "ko_KR",
    images: [
      {
        url: "/ogimg.png",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={cn(pretendard.variable, poppins.variable, "font-sans")}
    >
      <body>
        <div className="mx-auto min-h-screen w-full max-w-(--max-width) bg-white px-5 pb-9 shadow-2xl">
          <Header />
          <TooltipProvider>{children}</TooltipProvider>
        </div>
      </body>
    </html>
  );
}
