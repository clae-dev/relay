"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { RadioOption } from "@/components/RadioOption";
import { PrimaryButton, BottomCta } from "@/components/Button";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";
import type { UsageStatus } from "@/lib/types";

const OPTIONS: { value: UsageStatus; title: string; description: string }[] = [
  { value: "plenty", title: "많이 남음", description: "알림일을 다시 조정할게요." },
  { value: "almost_done", title: "거의 다 씀", description: "리필을 예약할게요." },
  { value: "stopped", title: "사용 중단", description: "다음에 예약할게요." },
];

export default function UsageCheckPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getSubscription, setUsageCheck } = useStore();
  const [selected, setSelected] = useState<UsageStatus>("almost_done");

  const sub = getSubscription(params.id);
  const product = sub ? PRODUCTS[sub.productId] : undefined;

  if (!sub || !product) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="RE:LAY" />
        <p className="p-6 text-center text-ink-faint">
          리필 구독 정보를 찾을 수 없어요.
        </p>
      </div>
    );
  }

  function handleConfirm() {
    setUsageCheck(sub!.id, selected);
    if (selected === "almost_done") {
      router.push(`/refill-checkout/${sub!.id}`);
    } else {
      router.push("/my/refills");
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="RE:LAY" showBag />

      <div className="px-4 pt-4">
        <h1 className="text-[17px] font-bold text-ink">리필 혜택가</h1>
      </div>

      <div className="mt-3 px-4">
        <div className="flex items-center gap-3 rounded-card border border-line p-3.5">
          <ProductThumb tone={product.tone} size={52} />
          <div>
            <p className="text-[13.5px] font-bold text-ink">
              {product.brand} {product.name}
            </p>
            <p className="text-[12.5px] text-ink-faint">
              {product.option} (리필)
            </p>
            <p className="mt-0.5 text-[14.5px] font-bold text-ink">
              {formatWon(product.refillPrice)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex-1 px-4">
        <h2 className="text-[15px] font-bold text-ink">
          제품을 거의 다 사용하셨나요?
        </h2>
        <p className="mt-1 text-[13px] text-ink-faint">
          사용 상태를 선택하면 리필 예약을 미룰 수 있어요.
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          {OPTIONS.map((opt) => (
            <RadioOption
              key={opt.value}
              selected={selected === opt.value}
              onSelect={() => setSelected(opt.value)}
              title={opt.title}
              description={opt.description}
            />
          ))}
        </div>
      </div>

      <BottomCta>
        <PrimaryButton onClick={handleConfirm}>구매하기</PrimaryButton>
      </BottomCta>
    </div>
  );
}
