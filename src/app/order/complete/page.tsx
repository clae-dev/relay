"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
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

  const product = PRODUCTS[lastOrder.productId];

  if (!lastOrder.withSubscription) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="결제 완료" showBag />

        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center px-6 pt-10">
            <CheckCircleIcon className="text-ink" />
            <h1 className="mt-4 text-center text-[19px] font-bold leading-snug text-ink">
              주문이 완료되었습니다
            </h1>
            <p className="mt-1 text-[13px] text-ink-faint">
              충분히 사용해 본 뒤 결정하세요
            </p>
          </div>

          <div className="mt-6 h-2 bg-surface" />

          <div className="px-4">
            <Row
              label="사용 기한"
              value={`${product?.benefitWindowDays ?? 120}일`}
            />
            <Row
              label="첫 리필"
              value={`본품과 동일한 ${product?.benefitPercent ?? 0}% 혜택`}
            />
          </div>

          <div className="px-4 pt-6">
            <Link href="/my/refills">
              <SecondaryButton>체험권 보기</SecondaryButton>
            </Link>
            <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-faint">
              구매일로부터 {product?.benefitWindowDays ?? 120}일 안에 신청하면
              <br />
              첫 리필을 당시 혜택가로 구매할 수 있어요.
            </p>
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

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="RE:LAY" showBack={false} showBag />

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-10">
          <CheckCircleIcon className="text-primary" />
          <h1 className="mt-4 text-center text-[19px] font-bold leading-snug text-ink">
            본품 주문과 리필 예약이 완료됐어요
          </h1>
          <p className="mt-1 text-[13px] text-ink-faint">
            소진 시점에 맞춰 리필 알림으로 알려드릴게요
          </p>
        </div>

        {product && (
          <div className="mt-6 px-4">
            <div className="flex items-center gap-3 rounded-card border border-line p-3.5">
              <ProductThumb tone={product.tone} size={56} />
              <div>
                <p className="text-[13.5px] font-bold text-ink">
                  {product.brand} {product.name}
                </p>
                <p className="text-[12.5px] text-ink-faint">
                  {product.option}
                </p>
                <p className="mt-0.5 text-[14px] font-bold text-ink">
                  {formatWon(product.price)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 px-4">
          <Row label="첫 리필 발송" value={lastOrder.nextRefillDate} />
          <Row
            label="결제 예정"
            value={formatWon(product?.refillPrice ?? 0)}
          />
          <Row label="알림" value="발송 3일 전" />
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 pb-6">
        <Link href="/my/refills">
          <SecondaryButton>리필 예약 관리</SecondaryButton>
        </Link>
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
