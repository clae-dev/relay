"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, BagIcon, HomeIcon, SearchIcon } from "./icons";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  backHref?: string;
  showHome?: boolean;
  showSearch?: boolean;
  showBag?: boolean;
}

export function TopBar({
  title,
  showBack = true,
  backHref,
  showHome = false,
  showSearch = false,
  showBag = false,
}: TopBarProps) {
  const router = useRouter();

  return (
    <div className="flex h-14 shrink-0 items-center justify-between border-b border-line/0 px-4">
      <div className="flex w-16 items-center">
        {showBack ? (
          backHref ? (
            <Link
              href={backHref}
              className="-ml-2 flex h-9 w-9 items-center justify-center text-ink"
              aria-label="뒤로가기"
            >
              <ArrowLeftIcon />
            </Link>
          ) : (
            <button
              onClick={() => router.back()}
              className="-ml-2 flex h-9 w-9 items-center justify-center text-ink"
              aria-label="뒤로가기"
            >
              <ArrowLeftIcon />
            </button>
          )
        ) : null}
      </div>
      <div className="flex-1 text-center text-[15px] font-bold tracking-tight text-ink">
        {title}
      </div>
      <div className="flex w-16 items-center justify-end gap-3 text-ink">
        {showHome && (
          <Link href="/" aria-label="홈">
            <HomeIcon />
          </Link>
        )}
        {showSearch && (
          <button aria-label="검색">
            <SearchIcon />
          </button>
        )}
        {showBag && (
          <Link href="/my/refills" aria-label="RE:LAY 마이페이지">
            <BagIcon />
          </Link>
        )}
      </div>
    </div>
  );
}
