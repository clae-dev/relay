import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { ProductThumb } from "@/components/ProductThumb";
import { PRODUCT_LIST, formatWon } from "@/lib/data";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <TopBar
        title="아모레몰"
        showBack={false}
        showSearch
        showBag
      />

      <Link
        href="/my/refills"
        className="mx-4 mt-2 flex items-center justify-between rounded-card bg-primary px-4 py-3 text-white"
      >
        <div>
          <p className="text-[13px] font-semibold opacity-80">RE:LAY</p>
          <p className="text-[15px] font-bold">내 리필 예약 관리하기</p>
        </div>
        <span className="text-lg">›</span>
      </Link>

      <div className="mt-5 px-4">
        <h1 className="text-[18px] font-bold text-ink">
          지금 구매하면 리필도 예약할 수 있어요
        </h1>
        <p className="mt-1 text-[13px] text-ink-faint">
          예약형 구독 RE:LAY — 시점은 내가, 가격은 미리
        </p>
      </div>

      <div className="mt-4 flex flex-col gap-3 px-4 pb-8">
        {PRODUCT_LIST.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex items-center gap-3 rounded-card border border-line p-3"
          >
            <ProductThumb tone={product.tone} size={72} />
            <div className="flex-1">
              <p className="text-[12.5px] font-semibold text-ink-faint">
                {product.brand}
              </p>
              <p className="text-[14.5px] font-bold leading-snug text-ink">
                {product.name}
              </p>
              <p className="text-[12.5px] text-ink-faint">{product.option}</p>
              <p className="mt-1 text-[15px] font-extrabold text-ink">
                {formatWon(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
