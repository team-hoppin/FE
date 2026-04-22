import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "./PretendardVariable.woff2",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
});

export const poppins = localFont({
  src: [
    {
      path: "./Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-poppins",
  display: "swap",
});