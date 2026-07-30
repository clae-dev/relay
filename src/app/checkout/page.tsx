"use client";

import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { PrimaryButton, BottomCta } from "@/components/Button";
import { ChevronDownIcon } from "@/components/icons";
import { PRODUCTS, addDays, formatWon } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function CheckoutPage() {
  const router = useRouter();
  const { draftPurchase, completePurchase } = useStore();

  const product = draftPurchase ? PRODUCTS[draftPurchase.productId] : undefined;

  if (!draftPurchase || !product) {
    return (
      <div className="flex flex-1 flex-col">
        <TopBar title="결제 하기" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <p className="text-ink-faint">진행 중인 주문이 없어요.</p>
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

  const withSubscription = draftPurchase.withSubscription;
  const firstShipEta = addDays(product.benefitWindowDays);

  function handlePay() {
    completePurchase();
    router.push("/order/complete");
  }

  return (
    <div className="flex flex-1 flex-col">
      <TopBar title="결제 하기" showBag />

      <div className="flex-1 overflow-y-auto pb-4">
        <Section title="배송지 정보" action="변경">
          <div className="flex items-center gap-2 text-[13.5px]">
            <span className="rounded bg-surface px-1.5 py-0.5 text-[11.5px] font-semibold text-ink-soft">
              기본배송지
            </span>
            <span className="font-bold text-ink">김연우</span>
            <span className="text-ink-faint">010-4365-9374</span>
          </div>
          <p className="mt-1.5 text-[13px] text-ink-soft">
            (06210) 서울 강남구 아모레로 152 강남 파이낸스센터 16층 1026호
          </p>
          <button className="mt-3 flex w-full items-center justify-between rounded-btn border border-line px-3 py-2.5 text-[13px] text-ink-faint">
            배송 요청사항 선택
            <ChevronDownIcon />
          </button>
        </Section>

        <Divider />

        <Section title="오늘 구매 상품">
          <ProductRow
            tone={product.tone}
            brand={product.brand}
            name={product.name}
            option={product.option}
            price={product.price}
          />
        </Section>

        {withSubscription && (
          <>
            <Divider />
            <Section title="리필 구독 예약">
              <ProductRow
                tone={product.tone}
                brand={product.brand}
                name={`${product.name} (리필)`}
                option={undefined}
                priceLabel="오늘 리필 0원 배송 전 결제"
              />
              <Row label="예상 첫 발송일" value={firstShipEta} />
              <Row label="알림" value="3일 전 알림" />
            </Section>
          </>
        )}

        <Divider />

        <Section title="결제 수단" action="변경">
          <p className="text-[13.5px] font-bold text-ink">신용카드</p>
          <p className="text-[13px] text-ink-faint">
            현대카드 1234 - ****** - 5678
          </p>
        </Section>

        <Divider />

        <div className="px-4 py-4">
          <div className="flex items-start justify-between">
            <h2 className="text-[15px] font-bold text-ink">오늘 결제 금액</h2>
            <div className="text-right">
              <p className="text-[19px] font-extrabold text-ink">
                {formatWon(product.price)}
              </p>
              <p className="mt-0.5 text-[13px] text-ink-faint">(운임 포함)</p>
              <button className="mt-0.5 flex items-center gap-0.5 text-[13px] text-ink-faint">
                상세
                <ChevronDownIcon />
              </button>
            </div>
          </div>
        </div>
      </div>

      <BottomCta>
        <PrimaryButton onClick={handlePay}>
          {formatWon(product.price)} 결제하고{" "}
          {withSubscription ? "리필 예약" : "구매하기"}
        </PrimaryButton>
      </BottomCta>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-4 py-4">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-ink">{title}</h2>
        {action && (
          <button className="text-[12.5px] font-semibold text-ink-faint underline underline-offset-2">
            {action}
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="h-2 bg-surface" />;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-2 flex items-center justify-between text-[13.5px]">
      <span className="text-ink-soft">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  );
}

function ProductRow({
  tone,
  brand,
  name,
  option,
  price,
  priceLabel,
}: {
  tone: "cushion" | "scalp";
  brand: string;
  name: string;
  option?: string;
  price?: number;
  priceLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <ProductThumb tone={tone} size={52} />
      <div className="flex-1">
        <p className="text-[13.5px] font-bold text-ink">
          {brand} {name}
        </p>
        {option && (
          <p className="text-[12.5px] text-ink-faint">{option} · 1개</p>
        )}
        {typeof price === "number" ? (
          <p className="mt-0.5 text-[14px] font-bold text-ink">
            {formatWon(price)}
          </p>
        ) : (
          priceLabel && (
            <p className="mt-0.5 text-[12.5px] font-semibold text-primary">
              {priceLabel}
            </p>
          )
        )}
      </div>
    </div>
  );
}
