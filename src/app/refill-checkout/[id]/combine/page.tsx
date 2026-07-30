"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { PrimaryButton, BottomCta } from "@/components/Button";
import { PRODUCTS } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function CombineSelectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    getSubscription,
    eligibleCombinePartners,
    draftRefillCheckout,
    startRefillCheckout,
    toggleCombinePartner,
    setCombineMode,
  } = useStore();

  const sub = getSubscription(params.id);
  const partners = sub ? eligibleCombinePartners(sub.id) : [];

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

  const draft = draftRefillCheckout?.primaryId === sub.id ? draftRefillCheckout : null;
  const combine = draft?.combine ?? false;
  const selectedIds = draft?.selectedIds ?? [sub.id];

  function handleComplete() {
    router.push(`/refill-checkout/${sub!.id}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="리필 결제" showBag />

      <div className="flex-1 overflow-y-auto px-4 pb-4 pt-4">
        <h1 className="text-[16px] font-bold text-ink">
          함께 받을 리필을 선택해 주세요
        </h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          준비 시점이 달라도 한 상자로 받을 수 있어요
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          <CombineItem
            locked
            checked
            tone={PRODUCTS[sub.productId]?.tone ?? "cushion"}
            title={`${PRODUCTS[sub.productId]?.brand ?? ""} 리필`}
            status={sub.deliveryEta}
          />
          {partners.map((p) => {
            const product = PRODUCTS[p.productId];
            if (!product) return null;
            const checked = selectedIds.includes(p.id);
            return (
              <CombineItem
                key={p.id}
                tone={product.tone}
                title={`${product.brand} 리필`}
                status={p.deliveryEta}
                checked={checked}
                onToggle={() => toggleCombinePartner(p.id)}
              />
            );
          })}
        </div>

        {partners.length > 0 && (
          <>
            <h2 className="mb-2.5 mt-8 text-[15px] font-bold text-ink">
              두 리필을 함께 받을까요?
            </h2>
            <div className="flex flex-col gap-2.5">
              <ShippingOption
                selected={combine}
                onSelect={() => setCombineMode(true)}
                title="함께 받기"
                description="한 상자로 무료배송"
                trailing={
                  <span className="text-[12.5px] font-bold text-accent">
                    +1,000P
                  </span>
                }
              />
              <ShippingOption
                selected={!combine}
                onSelect={() => setCombineMode(false)}
                title="먼저 준비된 상품 받기"
                description="따로 받아볼게요"
                trailing={
                  <span className="text-[12.5px] font-semibold text-ink-faint">
                    배송비 2,500원
                  </span>
                }
              />
            </div>
          </>
        )}
      </div>

      <BottomCta>
        <PrimaryButton onClick={handleComplete}>
          배송 방법 선택 완료
        </PrimaryButton>
      </BottomCta>
    </div>
  );
}

function CombineItem({
  tone,
  title,
  status,
  checked,
  locked,
  onToggle,
}: {
  tone: "cushion" | "scalp";
  title: string;
  status: string;
  checked: boolean;
  locked?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={locked}
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-card border p-3.5 text-left ${
        checked ? "border-primary bg-primary-soft/40" : "border-line"
      } ${locked ? "opacity-90" : ""}`}
    >
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked ? "border-primary bg-primary" : "border-ink-faint"
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="m5 12.5 4.5 4.5L19 7"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <ProductThumb tone={tone} size={48} />
      <div>
        <p className="text-[14px] font-bold text-ink">{title}</p>
        <p className="text-[12.5px] text-ink-faint">{status}</p>
      </div>
    </button>
  );
}

function ShippingOption({
  selected,
  onSelect,
  title,
  description,
  trailing,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  trailing: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between rounded-card border p-3.5 text-left ${
        selected ? "border-primary bg-primary-soft/40" : "border-line"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-primary" : "border-ink-faint"
          }`}
        >
          {selected && (
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          )}
        </span>
        <div>
          <p className="text-[14px] font-bold text-ink">{title}</p>
          <p className="text-[12.5px] text-ink-faint">{description}</p>
        </div>
      </div>
      {trailing}
    </button>
  );
}
