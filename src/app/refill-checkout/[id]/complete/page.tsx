"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { PrimaryButton, SecondaryButton } from "@/components/Button";
import { CheckCircleIcon } from "@/components/icons";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function RefillOrderCompletePage() {
  const router = useRouter();
  const { lastRefillOrder, getSubscription, continueSubscription, endSubscription } =
    useStore();

  if (!lastRefillOrder) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="결제 완료" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-ink-faint">완료된 리필 주문이 없어요.</p>
          <button
            onClick={() => router.push("/my/refills")}
            className="text-[14px] font-bold text-primary"
          >
            리필 관리로 가기
          </button>
        </div>
      </div>
    );
  }

  function handleDecision(keep: boolean) {
    for (const id of lastRefillOrder!.subscriptionIds) {
      if (keep) continueSubscription(id);
      else endSubscription(id);
    }
    router.push("/my/refills");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="결제 완료" showBag />

      <div className="flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col items-center px-6 pt-8">
          <CheckCircleIcon className="text-primary" />
          <h1 className="mt-4 text-center text-[18px] font-bold leading-snug text-ink">
            리필 주문이 완료되었습니다
          </h1>
          <p className="mt-1 text-[12.5px] text-ink-faint">
            주문번호 {lastRefillOrder.orderNo}
          </p>
        </div>

        <div className="mt-6 px-4">
          <div className="rounded-card bg-surface p-4">
            <p className="text-[13.5px] font-bold text-ink">
              다음 주문까지 보관중
            </p>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">
              다음 사용일에 맞춰 리필 사용을 도와드릴게요.
            </p>
            <button className="mt-3 w-full rounded-btn border border-ink py-2.5 text-[13px] font-bold text-ink">
              배송 상태 보기
            </button>
          </div>
        </div>

        <div className="mt-5 px-4">
          <h2 className="mb-2 text-[15px] font-bold text-ink">주문 상품</h2>
          <div className="flex flex-col gap-2.5">
            {lastRefillOrder.subscriptionIds.map((id) => {
              const sub = getSubscription(id);
              const product = sub ? PRODUCTS[sub.productId] : undefined;
              if (!product) return null;
              return (
                <div
                  key={id}
                  className="flex items-center gap-3 rounded-card border border-line p-3"
                >
                  <ProductThumb tone={product.tone} size={48} />
                  <div>
                    <p className="text-[13.5px] font-bold text-ink">
                      {product.brand} {product.name}
                    </p>
                    <p className="text-[12.5px] text-ink-faint">
                      {product.option}(리필)
                    </p>
                    <p className="mt-0.5 text-[14px] font-bold text-ink">
                      {formatWon(product.refillPrice)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          {lastRefillOrder.combined && (
            <p className="mt-2 text-[12px] text-primary">
              한 상자로 합배송돼요 (+1,000P 적립)
            </p>
          )}
        </div>

        <div className="mt-6 px-4">
          <div className="rounded-card border border-line p-4">
            <p className="text-[14px] font-bold text-ink">
              다음 리필도 RE:LAY로 관리할까요?
            </p>
            <p className="mt-0.5 text-[12.5px] text-ink-faint">
              다음 리필도 동일한 혜택으로 받아보세요.
            </p>
            <div className="mt-3 flex gap-2">
              <SecondaryButton
                onClick={() => handleDecision(true)}
                className="flex-1 py-2.5 text-[13px]"
              >
                혜택 이어가기
              </SecondaryButton>
              <button
                onClick={() => handleDecision(false)}
                className="flex-1 rounded-btn bg-ink py-2.5 text-[13px] font-bold text-white"
              >
                이번에 종료
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-6">
        <Link href="/">
          <PrimaryButton>쇼핑 계속하기</PrimaryButton>
        </Link>
      </div>
    </div>
  );
}
