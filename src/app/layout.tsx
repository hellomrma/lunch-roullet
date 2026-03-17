import type { Metadata, Viewport } from "next";
import { Black_Han_Sans, Noto_Sans_KR } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://pangyo-pick.vercel.app";

export const viewport: Viewport = {
  themeColor: "#080808",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "판교Pick",
    template: "%s | 판교Pick",
  },
  description:
    "판교테크노밸리(경기 성남시 분당구 대왕판교로 670 유스페이스) 주변 점심 맛집 23곳·회식 장소 46곳을 룰렛으로 랜덤 추천. 네이버 맵 길찾기 바로 연결.",
  keywords: [
    "판교Pick",
    "판교 맛집",
    "판교테크노밸리 점심",
    "판교테크노밸리 회식",
    "유스페이스 식당",
    "판교 런치 추천",
    "판교 회식 장소",
    "분당 점심 맛집",
    "판교역 맛집",
    "삼평동 음식점",
  ],
  authors: [{ name: "판교Pick" }],
  creator: "판교Pick",
  publisher: "판교Pick",

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: siteUrl,
    siteName: "판교Pick",
    title: "판교Pick — 판교테크노밸리 점심·회식 룰렛",
    description:
      "판교테크노밸리 유스페이스 주변 점심 맛집 23곳·회식 장소 46곳을 룰렛으로 랜덤 추천. 네이버 맵 길찾기 바로 연결.",
  },

  twitter: {
    card: "summary_large_image",
    title: "판교Pick — 판교테크노밸리 점심·회식 룰렛",
    description:
      "판교테크노밸리 유스페이스 주변 점심 맛집 23곳·회식 장소 46곳을 룰렛으로 랜덤 추천.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${blackHanSans.variable} ${notoSansKR.variable}`}>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
