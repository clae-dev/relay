import type { ProductTone } from "@/lib/types";

const TONE_STYLES: Record<ProductTone, string> = {
  cushion: "bg-gradient-to-br from-[#f4dcd2] to-[#e9c3b4]",
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
        <div
          className="absolute rounded-full border-[3px] border-[#121212]/85 bg-[#1c1c1c]/10"
          style={{
            width: size * 0.62,
            height: size * 0.62,
            top: size * 0.19,
            left: size * 0.19,
          }}
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
