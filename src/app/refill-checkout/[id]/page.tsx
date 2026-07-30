"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { PrimaryButton, BottomCta } from "@/components/Button";
import { ChevronDownIcon } from "@/components/icons";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function RefillCheckoutPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getSubscription,
    draftRefillCheckout,
    startRefillCheckout,
    completeRefillCheckout,
  } = useStore();

  const sub = getSubscription(params.id);

  useEffect(() => {
    if (!sub) return;
    if (!draftRefillCheckout || draftRefillCheckout.primaryId !== sub.id) {
      startRefillCheckout(sub.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sub?.id]);

  if (!sub) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="리필 결제" />
        <p className="p-6 text-center text-ink-faint">
          리필 구독 정보를 찾을 수 없어요.
        </p>
      </div>
    );
  }

  const includedIds =
    draftRefillCheckout && draftRefillCheckout.primaryId === sub.id
      ? draftRefillCheckout.combine
        ? draftRefillCheckout.selectedIds
        : [draftRefillCheckout.primaryId]
      : [sub.id];

  const combine =
    draftRefillCheckout?.primaryId === sub.id && draftRefillCheckout.combine;

  const total = includedIds.reduce((sum, id) => {
    const s = getSubscription(id);
    const p = s ? PRODUCTS[s.productId] : undefined;
    return sum + (p?.refillPrice ?? 0);
  }, 0);

  function handlePay() {
    completeRefillCheckout();
    router.push(`/refill-checkout/${sub!.id}/complete`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="리필 결제" showBag />

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="px-4 pt-4">
          <h2 className="mb-2.5 text-[15px] font-bold text-ink">
            주문 상품
          </h2>
          <div className="flex flex-col gap-2.5">
            {includedIds.map((id) => {
              const s = getSubscription(id);
              const p = s ? PRODUCTS[s.productId] : undefined;
              if (!s || !p) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-card border border-line p-3"
                >
                  <ProductThumb tone={p.tone} size={52} />
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">
                      {p.brand}
                    </p>
                    <p className="text-[13px] text-ink-soft leading-snug">
                      {p.name}
                    </p>
                    <p className="text-[12.5px] text-ink-faint">
                      {p.option}(리필)
                    </p>
                    <p className="mt-0.5 text-[14px] font-bold text-ink">
                      {formatWon(p.refillPrice)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 h-2 bg-surface" />

        <div className="px-4 py-4">
          <h2 className="mb-2 text-[15px] font-bold text-ink">배송 방법</h2>
          <Link
            href={`/refill-checkout/${sub.id}/combine`}
            className="flex w-full items-center justify-between rounded-card border border-line px-3.5 py-3"
          >
            <div>
              <p className="text-[13.5px] font-bold text-ink">
                {combine ? "함께 받기" : "받을 리필 선택"}
              </p>
              <p className="text-[12px] text-ink-faint">
                {combine ? "한 상자로 무료배송" : "다른 리필과 합배송할 수 있어요"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-accent">
              {combine && (
                <span className="text-[12.5px] font-bold">+1,000P</span>
              )}
              <ChevronDownIcon className="-rotate-90 text-ink-faint" />
            </div>
          </Link>
        </div>

        <div className="h-2 bg-surface" />

        <div className="px-4 py-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">결제 수단</h2>
            <button className="text-[12.5px] font-semibold text-ink-faint underline underline-offset-2">
              변경
            </button>
          </div>
          <p className="text-[13.5px] font-bold text-ink">신용카드</p>
          <p className="text-[13px] text-ink-faint">
            현대카드 1234 - ****** - 5678
          </p>
        </div>

        <div className="h-2 bg-surface" />

        <div className="px-4 py-4">
          <h2 className="mb-2 text-[15px] font-bold text-ink">
            오늘 결제 금액
          </h2>
          <div className="flex items-end justify-between">
            <span className="text-[13px] text-ink-faint">(운임 포함)</span>
            <span className="text-[19px] font-extrabold text-ink">
              {formatWon(total)}
            </span>
          </div>
        </div>
      </div>

      <BottomCta>
        <PrimaryButton onClick={handlePay}>결제하기</PrimaryButton>
      </BottomCta>
    </div>
  );
}
