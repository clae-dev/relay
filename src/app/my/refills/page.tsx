"use client";

import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { ProgressBar } from "@/components/ProgressBar";
import { SecondaryButton, DangerGhostButton, PrimaryButton } from "@/components/Button";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { RefillSubscription } from "@/lib/types";

export default function MyRefillsPage() {
  const {
    subscriptions,
    changeNotifyDate,
    skipCycle,
    endSubscription,
    continueSubscription,
    claimVoucher,
  } = useStore();

  const vouchers = subscriptions.filter((s) => s.status === "voucher");
  const active = subscriptions.filter(
    (s) => s.status !== "ended" && s.status !== "voucher",
  );
  const ended = subscriptions.filter((s) => s.status === "ended");

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="RE:LAY" showHome />

      <div className="px-4 pb-2 pt-4">
        <h1 className="text-[17px] font-bold text-ink">사용 중인 리필 관리</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8">
        {vouchers.length > 0 && (
          <div className="mb-6">
            <h2 className="mb-2 text-[13.5px] font-bold text-ink-faint">
              체험권
            </h2>
            <div className="flex flex-col gap-3">
              {vouchers.map((sub) => (
                <VoucherCard
                  key={sub.id}
                  sub={sub}
                  onClaim={() => claimVoucher(sub.id)}
                />
              ))}
            </div>
          </div>
        )}

        {active.length === 0 && vouchers.length === 0 && (
          <p className="mt-10 text-center text-[13.5px] text-ink-faint">
            진행 중인 리필 구독이 없어요.
          </p>
        )}

        <div className="flex flex-col gap-3">
          {active.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              sub={sub}
              onChangeDate={() => {
                const value = window.prompt(
                  "새 알림 예정일을 입력해 주세요 (YYYY.MM.DD)",
                  sub.nextNotifyDate,
                );
                if (value) changeNotifyDate(sub.id, value);
              }}
              onSkip={() => {
                if (window.confirm("이번 회차를 건너뛸까요?")) {
                  skipCycle(sub.id);
                }
              }}
              onEnd={() => {
                if (window.confirm("리필 구독 혜택을 종료할까요?")) {
                  endSubscription(sub.id);
                }
              }}
            />
          ))}
        </div>

        {ended.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-2 text-[13.5px] font-bold text-ink-faint">
              종료된 혜택
            </h2>
            <div className="flex flex-col gap-2">
              {ended.map((sub) => {
                const product = PRODUCTS[sub.productId];
                if (!product) return null;
                return (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 rounded-card border border-line px-3 py-2.5 opacity-70"
                  >
                    <ProductThumb tone={product.tone} size={40} />
                    <div className="flex-1">
                      <p className="text-[13px] font-bold text-ink">
                        {product.brand} {product.name}
                      </p>
                      <p className="text-[12px] text-ink-faint">
                        혜택이 종료되었어요
                      </p>
                    </div>
                    <button
                      onClick={() => continueSubscription(sub.id)}
                      className="shrink-0 text-[12.5px] font-bold text-primary underline underline-offset-2"
                    >
                      다시 시작
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VoucherCard({
  sub,
  onClaim,
}: {
  sub: RefillSubscription;
  onClaim: () => void;
}) {
  const product = PRODUCTS[sub.productId];
  if (!product) return null;

  return (
    <div className="rounded-card border border-line p-4">
      <div className="flex items-start gap-3">
        <ProductThumb tone={product.tone} size={56} />
        <div className="flex-1">
          <p className="text-[13.5px] font-bold text-ink">
            {product.brand} {product.name}
          </p>
          <p className="text-[12.5px] text-ink-faint">{product.option}</p>
          <span className="mt-1 inline-block rounded-full bg-primary-soft/60 px-2 py-0.5 text-[11.5px] font-semibold text-primary">
            체험권
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[13.5px]">
        <span className="text-ink-soft">첫 리필 혜택</span>
        <span className="font-bold text-ink">
          본품과 동일한 {product.benefitPercent}% 혜택
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[13.5px]">
        <span className="text-ink-soft">신청 가능 기한</span>
        <span className="font-bold text-ink">{sub.nextNotifyDate}까지</span>
      </div>

      <div className="mt-4">
        <PrimaryButton onClick={onClaim}>지금 신청하기</PrimaryButton>
      </div>
    </div>
  );
}

function SubscriptionCard({
  sub,
  onChangeDate,
  onSkip,
  onEnd,
}: {
  sub: RefillSubscription;
  onChangeDate: () => void;
  onSkip: () => void;
  onEnd: () => void;
}) {
  const product = PRODUCTS[sub.productId];
  if (!product) return null;

  const statusLabel =
    sub.status === "pending_shipment"
      ? "발송 준비"
      : sub.status === "checkout_ready"
        ? "결제 대기"
        : "사용 중";

  return (
    <div className="rounded-card border border-line p-4">
      <div className="flex items-start gap-3">
        <ProductThumb tone={product.tone} size={56} />
        <div className="flex-1">
          <p className="text-[13.5px] font-bold text-ink">
            {product.brand} {product.name}
          </p>
          <p className="text-[12.5px] text-ink-faint">{product.option}</p>
          <span className="mt-1 inline-block rounded-full bg-surface px-2 py-0.5 text-[11.5px] font-semibold text-ink-soft">
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[13.5px]">
        <span className="text-ink-soft">저장한 혜택</span>
        <span className="font-bold text-ink">
          {formatWon(product.price - product.refillPrice)}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[13.5px]">
        <span className="text-ink-soft">
          {sub.status === "pending_shipment" ? "배송 상태" : "다음 알림 예정일"}
        </span>
        <span className="font-bold text-ink">
          {sub.status === "pending_shipment" ? sub.deliveryEta : sub.nextNotifyDate}
        </span>
      </div>

      {sub.status !== "pending_shipment" && (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center justify-between text-[12px] text-ink-faint">
            <span>이번 회차 진행률</span>
            <span>{sub.cycleProgress}%</span>
          </div>
          <ProgressBar percent={sub.cycleProgress} />
        </div>
      )}

      {sub.status === "checkout_ready" ? (
        <div className="mt-4">
          <Link href={`/refill-checkout/${sub.id}`}>
            <PrimaryButton>리필 결제하러 가기</PrimaryButton>
          </Link>
        </div>
      ) : sub.status === "in_progress" ? (
        <div className="mt-4 flex flex-col gap-2">
          <Link href={`/my/refills/${sub.id}/check`}>
            <SecondaryButton>리필 사용 여부 확인하기</SecondaryButton>
          </Link>
          <div className="flex gap-2">
            <button
              onClick={onChangeDate}
              className="flex-1 rounded-btn border border-line py-2.5 text-[12.5px] font-bold text-ink"
            >
              알림일 변경
            </button>
            <button
              onClick={onSkip}
              className="flex-1 rounded-btn border border-line py-2.5 text-[12.5px] font-bold text-ink"
            >
              이번 회차 건너뛰기
            </button>
          </div>
          <DangerGhostButton onClick={onEnd} className="py-2.5 text-[12.5px]">
            혜택 종료
          </DangerGhostButton>
        </div>
      ) : null}
    </div>
  );
}
