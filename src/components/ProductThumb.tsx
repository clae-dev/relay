import Image from "next/image";
import type { ProductTone } from "@/lib/types";

const TONE_STYLES: Record<ProductTone, string> = {
  cushion: "bg-[#f4dcd2]",
  scalp: "bg-[#f2ede2]",
};

export function ProductThumb({
  tone,
  size = 64,
}: {
  tone: ProductTone;
  size?: number;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl ${TONE_STYLES[tone]}`}
      style={{ width: size, height: size }}
    >
      {tone === "cushion" ? (
        <Image
          src="/products/hera-cushion-v2.png"
          alt="헤라 블랙 쿠션 파운데이션"
          fill
          sizes={`${size}px`}
          quality={70}
          className="object-cover"
        />
      ) : (
        <Image
          src="/products/libeauche-refill.png"
          alt="리보에이치 두피 강화 클리닉 리필"
          fill
          sizes={`${size}px`}
          quality={70}
          className="object-cover"
        />
      )}
    </div>
  );
}
