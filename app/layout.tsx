import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jaehyuk Park — AI Researcher",
  description:
    "Jaehyuk Park researches computer vision, generative human motion, character identity, and AI for film and animation.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
