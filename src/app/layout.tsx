import type { Metadata } from "next";
import { Black_Han_Sans, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const blackHanSans = Black_Han_Sans({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-black-han",
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  title: "판교테크노밸리 런치 룰렛",
  description: "판교테크노밸리 주변 점심 메뉴를 룰렛으로 결정하세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${blackHanSans.variable} ${notoSansKR.variable}`}>
        {children}
      </body>
    </html>
  );
}
