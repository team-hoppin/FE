import type { Metadata } from "next";
import Script from "next/script";
import { pretendard, poppins } from "./fonts/fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import AlertModal from "@/components/common/alert-modal";
import ToastProvider from "@/components/ui/toast-provider";
import QueryProvider from "@/components/common/query-provider";

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
        id="gtm-snippet"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N67BVLG8');`,
        }}
      />
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
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N67BVLG8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <div className="mx-auto flex min-h-screen w-full max-w-(--max-width) flex-col shadow-2xl">
          <div
            id="app-root"
            className="flex flex-1 flex-col bg-white px-5 pb-9"
          >
            <QueryProvider>
              <TooltipProvider>{children}</TooltipProvider>
            </QueryProvider>
          </div>
          <AlertModal />
          <ToastProvider />
        </div>
      </body>
    </html>
  );
}
