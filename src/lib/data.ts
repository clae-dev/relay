import type { Product, RefillSubscription } from "./types";

export const PRODUCTS: Record<string, Product> = {
  "hera-cushion": {
    id: "hera-cushion",
    brand: "헤라",
    name: "블랙 쿠션 파운데이션 SPF34/PA++",
    option: "15g / 21N1",
    tone: "cushion",
    price: 46800,
    refillPrice: 37440,
    benefitPercent: 20,
    benefitWindowDays: 120,
    giftLine: "프리미엄 사은품 + 3,900원 페이백",
  },
  "libeauche-scalp": {
    id: "libeauche-scalp",
    brand: "리보에이치",
    name: "두피 강화 클리닉 탈모증상 완화 종이리필",
    option: "400ml",
    tone: "scalp",
    price: 46800,
    refillPrice: 37440,
    benefitPercent: 20,
    benefitWindowDays: 120,
    giftLine: "리필 전용 파우치 증정",
  },
};

export const PRODUCT_LIST = Object.values(PRODUCTS);

export function seedSubscriptions(): RefillSubscription[] {
  return [
    {
      id: "sub-hera",
      productId: "hera-cushion",
      status: "in_progress",
      cycleProgress: 75,
      nextNotifyDate: "2026.09.22",
      deliveryEta: "배송 준비 완료",
      usageCheck: null,
      cycleCount: 1,
    },
    {
      id: "sub-libeauche",
      productId: "libeauche-scalp",
      status: "in_progress",
      cycleProgress: 20,
      nextNotifyDate: "2026.10.09",
      deliveryEta: "7일 후 예상",
      usageCheck: null,
      cycleCount: 1,
    },
  ];
}

export function formatWon(amount: number): string {
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function generateOrderNo(): string {
  const d = new Date();
  const y = String(d.getFullYear()).slice(2);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 899999);
  return `${y}${m}${day}-${rand}`;
}

export function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0",
  )}.${String(d.getDate()).padStart(2, "0")}`;
}
