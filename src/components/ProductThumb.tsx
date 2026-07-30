import Image from "next/image";
import type { ProductTone } from "@/lib/types";

const TONE_STYLES: Record<ProductTone, string> = {
  cushion: "bg-[#f4dcd2]",
  scalp: "bg-gradient-to-br from-[#3f4a34] to-[#2b3324]",
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
          quality={95}
          className="object-cover"
        />
      ) : (
        <div
          className="absolute rounded-md bg-[#c9d6b9]/90"
          style={{
            width: size * 0.5,
            height: size * 0.32,
            top: size * 0.16,
            left: size * 0.25,
          }}
        />
      )}
    </div>
  );
}
