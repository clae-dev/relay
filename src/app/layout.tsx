import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "RE:LAY — 리필 구독 예약 프로토타입",
  description:
    "아모레몰 리필 합배송 · 예약형 구독(Pull) 서비스 RE:LAY 클릭 프로토타입",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full">
        <StoreProvider>
          <div className="min-h-dvh bg-[#ececec] py-0 sm:py-8">
            <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-white sm:min-h-[880px] sm:rounded-[36px] sm:shadow-2xl sm:shadow-black/10 sm:ring-1 sm:ring-black/5">
              {children}
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
