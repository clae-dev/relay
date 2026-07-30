"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { BottomSheet } from "@/components/BottomSheet";
import { RadioOption } from "@/components/RadioOption";
import { PrimaryButton, BottomCta } from "@/components/Button";
import { HeartIcon, ShareIcon } from "@/components/icons";
import { PRODUCTS, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { setDraftPurchase } = useStore();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [withSubscription, setWithSubscription] = useState(true);
  const [liked, setLiked] = useState(false);

  const product = PRODUCTS[params.slug];

  if (!product) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="상품을 찾을 수 없어요" />
        <p className="p-6 text-center text-ink-faint">
          존재하지 않는 상품입니다.
        </p>
      </div>
    );
  }

  function handleConfirm() {
    setDraftPurchase(product.id, withSubscription);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar showHome showSearch showBag />

      <div className="relative aspect-square w-full overflow-hidden">
        <ProductThumbFull tone={product.tone} />
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full ${
                i === 3 ? "bg-ink" : "bg-ink/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-4 pt-3">
        <div
          className="h-[35px] w-[35px] rounded-[8px]"
          style={{ background: product.swatchColor }}
        />
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-medium text-ink">
            {product.brand} <span className="ml-0.5">›</span>
          </p>
          <ShareIcon className="text-ink-faint" />
        </div>
        <p className="mt-1.5 text-[16px] font-normal leading-snug text-ink">
          {product.detailTitle}
        </p>
        <p className="text-[13.5px] text-ink-faint">{product.option}</p>

        <div className="mt-3">
          <p className="text-[22px] font-extrabold text-ink">
            {product.price.toLocaleString("ko-KR")}
            <span className="text-[16px] font-semibold">원</span>
          </p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-[22px] font-extrabold text-accent">
              {product.maxBenefitPrice.toLocaleString("ko-KR")}
              <span className="text-[16px] font-semibold">원</span>
            </p>
            <span className="flex items-center gap-0.5 text-[13px] font-medium text-accent">
              최대 혜택가
              <span className="text-[12px]" aria-hidden>
                ⓘ
              </span>
            </span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-card border border-[#F0F0F0] px-[21px] py-[19px] pr-[29px]">
          <div>
            <p className="text-[13.5px] font-bold text-primary">
              RE:LAY 체험 혜택
            </p>
            <p className="text-[13px] text-ink-soft">
              첫 리필도 지금 할인가로
            </p>
            <p className="text-[11.5px] text-ink-faint">
              구매 후 {product.benefitWindowDays}일 안에 예약
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-accent px-2.5 py-1 text-[12px] font-bold text-accent">
            {product.benefitPercent}%혜택
          </span>
        </div>

        <div className="mt-3 rounded-card bg-surface px-4 py-3 text-center text-[13px] font-semibold text-ink-soft">
          + {product.giftLine}
        </div>
      </div>

      <div className="flex-1" />

      <BottomCta>
        <div className="flex items-center gap-2">
          <button
            aria-label="찜하기"
            onClick={() => setLiked((v) => !v)}
            className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border ${
              liked ? "border-accent text-accent" : "border-line text-ink-faint"
            }`}
          >
            <HeartIcon className={liked ? "fill-accent" : ""} />
          </button>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-[#03C75A] py-3.5 text-[15px] font-bold text-[#03C75A] transition active:opacity-70"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#03C75A] text-[10px] font-bold text-white">
              N
            </span>
            pay 구매
          </button>
          <PrimaryButton
            onClick={() => setSheetOpen(true)}
            className="flex-1 rounded-2xl"
          >
            구매하기
          </PrimaryButton>
        </div>
      </BottomCta>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)}>
        <h2 className="text-center text-[17px] font-bold text-ink">
          리필 구독 함께 신청
        </h2>

        <div className="mt-4 flex items-center gap-3">
          <ProductThumb tone={product.tone} size={48} />
          <div>
            <p className="text-[13.5px] font-bold text-ink">
              {product.brand} {product.name}
            </p>
            <p className="text-[12.5px] text-ink-faint">{product.option}</p>
            <p className="text-[13px] font-bold text-ink">
              {formatWon(product.price)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <RadioOption
            selected={!withSubscription}
            onSelect={() => setWithSubscription(false)}
            title="본품만 구매"
            description="리필 구독을 신청하지 않고 본품만 구매해요."
          />
          <RadioOption
            selected={withSubscription}
            onSelect={() => setWithSubscription(true)}
            title="본품 + 리필 구독 예약"
            description="리필만 별도 배송되며 구독가를 미리 확보해요."
          />
        </div>

        {withSubscription && (
          <div className="mt-3 rounded-card bg-surface px-4 py-3">
            <div className="flex items-center justify-between text-[13.5px]">
              <span className="text-ink-soft">리필 구독가</span>
              <span className="font-bold text-ink">
                {formatWon(product.refillPrice)}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[13px]">
              <span className="text-ink-soft">첫 리필 안내</span>
              <span className="text-ink-faint">
                예상 소진 {product.benefitWindowDays}일 후
              </span>
            </div>
            <p className="mt-1 text-right text-[11.5px] text-ink-faint">
              예상 시점 14일 전에 사용 여부를 확인해요
            </p>
          </div>
        )}

        <p className="mt-3 text-center text-[12px] text-ink-faint">
          리필 금액은 수령을 확정할 때 결제돼요.
        </p>

        <div className="mt-4">
          <PrimaryButton onClick={handleConfirm}>구매하기</PrimaryButton>
        </div>
      </BottomSheet>
    </div>
  );
}

function ProductThumbFull({ tone }: { tone: "cushion" | "scalp" }) {
  if (tone === "cushion") {
    return (
      <Image
        src="/products/hera-cushion-swirl.png"
        alt="헤라 블랙 쿠션 파운데이션"
        fill
        priority
        sizes="430px"
        quality={95}
        className="object-cover"
      />
    );
  }
  return (
    <div className="h-full w-full bg-gradient-to-br from-[#4a5a3e] via-[#3c4a32] to-[#28331f]">
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-32 w-24 rounded-2xl bg-[#cfe0b9]/80" />
      </div>
    </div>
  );
}
