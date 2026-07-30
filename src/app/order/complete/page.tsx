"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CheckCircleIcon } from "@/components/icons";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function OrderCompletePage() {
  const router = useRouter();
  const { lastOrder } = useStore();

  if (!lastOrder) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="RE:LAY" showBack={false} />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-ink-faint">완료된 주문 내역이 없어요.</p>
          <button
            onClick={() => router.push("/")}
            className="text-[14px] font-bold text-primary"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="RE:LAY" showBack={false} showBag />

      <div className="flex flex-col items-center px-6 pt-10">
        <CheckCircleIcon className="text-primary" />
        <h1 className="mt-4 text-center text-[19px] font-bold leading-snug text-ink">
          {lastOrder.withSubscription
            ? "본품 주문과 리필 예약이 완료됐어요"
            : "주문이 완료됐어요"}
        </h1>
        {lastOrder.withSubscription && (
          <p className="mt-1 text-[13px] text-ink-faint">
            소진 시점에 맞춰 리필 알림으로 알려드릴게요
          </p>
        )}
      </div>

      <div className="mt-8 flex-1 px-4">
        {lastOrder.withSubscription && (
          <>
            <Row label="첫 리필 발송" value={lastOrder.nextRefillDate} />
            <Row
              label="결제 예정"
              value={formatWon(
                PRODUCTS[lastOrder.productId]?.refillPrice ?? 0,
              )}
            />
            <Row label="알림" value="발송 3일 전" />
          </>
        )}
        {!lastOrder.withSubscription && (
          <Row label="결제 금액" value={formatWon(lastOrder.paidAmount)} />
        )}
      </div>

      <div className="flex flex-col gap-2 px-4 pb-6">
        {lastOrder.withSubscription && (
          <Link href="/my/refills">
            <SecondaryButton>리필 예약 관리</SecondaryButton>
          </Link>
        )}
        <Link href="/">
          <PrimaryButton>쇼핑 계속하기</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line py-3.5 text-[14px]">
      <span className="text-ink-soft">{label}</span>
      <span className="font-bold text-ink">{value}</span>
    </div>
  );
}
