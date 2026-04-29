import type { Metadata } from "next";
import Script from "next/script";
import { pretendard, poppins } from "./fonts/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import AlertModal from "@/components/common/alert-modal";
import Header from "@/components/common/header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.musicpeak.site"),
  title: "PEAK",
  description:
    "인스타 게시물부터 스트리밍까지, 어디서 팬이 끊기는지 확인하세요.",
  openGraph: {
    type: "website",
    url: "/",
    title: "신곡 홍보했는데 왜 아무도 안 듣지? 싶을 땐 PEAK",
    description:
      "인스타 게시물부터 스트리밍까지, 어디서 팬이 끊기는지 확인하세요.",
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
      <Script
        id="maze-snippet"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function (m, a, z, e) {
  var s, t, u, v;
  try { t = m.sessionStorage.getItem('maze-us'); } catch (err) {}
  if (!t) { t = new Date().getTime(); try { m.sessionStorage.setItem('maze-us', t); } catch (err) {} }
  u = document.currentScript || (function () { var w = document.getElementsByTagName('script'); return w[w.length - 1]; })();
  v = u && u.nonce;
  s = a.createElement('script');
  s.src = z + '?apiKey=' + e;
  s.async = true;
  if (v) s.setAttribute('nonce', v);
  a.getElementsByTagName('head')[0].appendChild(s);
  m.mazeUniversalSnippetApiKey = e;
})(window, document, 'https://snippet.maze.co/maze-universal-loader.js', 'fae9f26d-e465-4de0-b44d-643e3cbf66e7');`,
        }}
      />
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-(--max-width) flex-col bg-white px-5 pb-9 shadow-2xl">
          <Header />
          <div className="flex flex-1 flex-col">
            <TooltipProvider>{children}</TooltipProvider>
          </div>
          <AlertModal />
          <Toaster position="top-center" />
        </div>
      </body>
    </html>
  );
}
