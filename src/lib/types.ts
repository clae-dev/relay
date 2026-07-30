export type ProductTone = "cushion" | "scalp";

export interface Product {
  id: string;
  brand: string;
  name: string;
  detailTitle: string; // full title shown on the product detail page heading
  option: string;
  tone: ProductTone;
  price: number;
  maxBenefitPrice: number; // today-only flash price shown as a marketing badge (not charged at checkout)
  refillPrice: number;
  benefitPercent: number;
  benefitWindowDays: number;
  giftLine: string;
}

export type UsageStatus = "plenty" | "almost_done" | "stopped";

export type SubscriptionStatus =
  | "voucher" // 본품만 구매 — 아직 구독을 신청하지 않았지만 기한 내 혜택가로 신청 가능
  | "in_progress" // 사용 중, 다음 알림 대기
  | "pending_shipment" // 리필 예약 완료, 첫 발송 대기 (구독 직후)
  | "checkout_ready" // 사용상태 체크 후 결제 대기
  | "ended"; // 혜택 종료 (또는 체험권 만료)

export interface RefillSubscription {
  id: string;
  productId: string;
  status: SubscriptionStatus;
  cycleProgress: number; // 0-100
  nextNotifyDate: string; // YYYY.MM.DD — voucher 상태일 때는 만료일을 의미
  deliveryEta: string; // "배송 준비 완료" | "7일 후 예상" 등
  usageCheck: UsageStatus | null;
  cycleCount: number;
}

export interface DraftPurchase {
  productId: string;
  withSubscription: boolean;
}

export interface CompletedOrder {
  orderNo: string;
  productId: string;
  withSubscription: boolean;
  paidAmount: number;
  nextRefillDate: string;
}

export interface RefillOrderResult {
  orderNo: string;
  subscriptionIds: string[];
  combined: boolean;
  paidAmount: number;
}
