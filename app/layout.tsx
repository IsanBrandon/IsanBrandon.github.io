import type { Metadata } from "next";
import "./globals.css";

const description = "일상과 예술, 공부와 연구를 기록하는 이산재혁의 개인 블로그입니다.";

export const metadata: Metadata = {
  metadataBase: new URL("https://isanbrandon.github.io"),
  title: {
    default: "이산재혁",
    template: "%s | 이산재혁",
  },
  description,
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://isanbrandon.github.io/",
    siteName: "이산재혁",
    title: "이산재혁",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "이산재혁 — 일상과 예술, 공부와 연구의 기록" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이산재혁",
    description,
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
