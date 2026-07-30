"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  PRODUCTS,
  addDays,
  formatWon,
  generateOrderNo,
  seedSubscriptions,
} from "./data";
import type {
  CompletedOrder,
  DraftPurchase,
  RefillOrderResult,
  RefillSubscription,
  UsageStatus,
} from "./types";

const STORAGE_KEY = "relay-prototype-state-v1";

interface DraftRefillCheckout {
  primaryId: string;
  selectedIds: string[];
  combine: boolean;
}

interface State {
  subscriptions: RefillSubscription[];
  draftPurchase: DraftPurchase | null;
  lastOrder: CompletedOrder | null;
  draftRefillCheckout: DraftRefillCheckout | null;
  lastRefillOrder: RefillOrderResult | null;
}

function initialState(): State {
  return {
    subscriptions: seedSubscriptions(),
    draftPurchase: null,
    lastOrder: null,
    draftRefillCheckout: null,
    lastRefillOrder: null,
  };
}

interface StoreApi extends State {
  getSubscription: (id: string) => RefillSubscription | undefined;
  eligibleCombinePartners: (id: string) => RefillSubscription[];
  setDraftPurchase: (productId: string, withSubscription: boolean) => void;
  completePurchase: () => CompletedOrder;
  setUsageCheck: (id: string, status: UsageStatus) => void;
  changeNotifyDate: (id: string, newDate: string) => void;
  skipCycle: (id: string) => void;
  endSubscription: (id: string) => void;
  continueSubscription: (id: string) => void;
  startRefillCheckout: (primaryId: string) => void;
  toggleCombinePartner: (partnerId: string) => void;
  setCombineMode: (combine: boolean) => void;
  completeRefillCheckout: () => RefillOrderResult;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time hydration from localStorage after mount: the server render
    // (and the client's first paint, to match it) always uses the seed
    // state, since localStorage isn't available during SSR. Merging the
    // persisted state here — rather than in a lazy useState initializer —
    // is what keeps that first paint identical on server and client.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as State;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const getSubscription = useCallback(
    (id: string) => state.subscriptions.find((s) => s.id === id),
    [state.subscriptions],
  );

  const eligibleCombinePartners = useCallback(
    (id: string) =>
      state.subscriptions.filter(
        (s) => s.id !== id && s.status !== "ended",
      ),
    [state.subscriptions],
  );

  const setDraftPurchase = useCallback(
    (productId: string, withSubscription: boolean) => {
      setState((prev) => ({
        ...prev,
        draftPurchase: { productId, withSubscription },
      }));
    },
    [],
  );

  const completePurchase = useCallback((): CompletedOrder => {
    let result: CompletedOrder | null = null;
    setState((prev) => {
      const draft = prev.draftPurchase;
      const product = draft ? PRODUCTS[draft.productId] : undefined;
      if (!draft || !product) return prev;

      const paidAmount = draft.withSubscription
        ? product.price
        : product.price;
      const nextRefillDate = addDays(product.benefitWindowDays);

      const order: CompletedOrder = {
        orderNo: generateOrderNo(),
        productId: draft.productId,
        withSubscription: draft.withSubscription,
        paidAmount,
        nextRefillDate,
      };
      result = order;

      let subscriptions = prev.subscriptions;
      if (draft.withSubscription) {
        const existingIndex = subscriptions.findIndex(
          (s) => s.productId === draft.productId,
        );
        const nextSub: RefillSubscription = {
          id: existingIndex >= 0 ? subscriptions[existingIndex].id : `sub-${draft.productId}-${Date.now()}`,
          productId: draft.productId,
          status: "in_progress",
          cycleProgress: 0,
          nextNotifyDate: nextRefillDate,
          deliveryEta: "예약됨",
          usageCheck: null,
          cycleCount: 1,
        };
        subscriptions =
          existingIndex >= 0
            ? subscriptions.map((s, i) => (i === existingIndex ? nextSub : s))
            : [...subscriptions, nextSub];
      }

      return {
        ...prev,
        subscriptions,
        lastOrder: order,
        draftPurchase: null,
      };
    });
    return (
      result ?? {
        orderNo: generateOrderNo(),
        productId: "",
        withSubscription: false,
        paidAmount: 0,
        nextRefillDate: "",
      }
    );
  }, []);

  const setUsageCheck = useCallback((id: string, status: UsageStatus) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === id
          ? {
              ...s,
              usageCheck: status,
              status: status === "almost_done" ? "checkout_ready" : s.status,
              nextNotifyDate:
                status === "plenty" ? addDays(14) : s.nextNotifyDate,
            }
          : s,
      ),
    }));
  }, []);

  const changeNotifyDate = useCallback((id: string, newDate: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === id ? { ...s, nextNotifyDate: newDate } : s,
      ),
    }));
  }, []);

  const skipCycle = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === id
          ? { ...s, nextNotifyDate: addDays(14), cycleProgress: Math.max(0, s.cycleProgress - 20) }
          : s,
      ),
    }));
  }, []);

  const endSubscription = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === id ? { ...s, status: "ended" } : s,
      ),
    }));
  }, []);

  const continueSubscription = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      subscriptions: prev.subscriptions.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "in_progress",
              cycleProgress: 0,
              usageCheck: null,
              deliveryEta: "예약됨",
              nextNotifyDate: addDays(120),
              cycleCount: s.cycleCount + 1,
            }
          : s,
      ),
    }));
  }, []);

  const startRefillCheckout = useCallback((primaryId: string) => {
    setState((prev) => {
      const partnerIds = prev.subscriptions
        .filter((s) => s.id !== primaryId && s.status !== "ended")
        .map((s) => s.id);
      return {
        ...prev,
        draftRefillCheckout: {
          primaryId,
          selectedIds: [primaryId, ...partnerIds],
          combine: partnerIds.length > 0,
        },
      };
    });
  }, []);

  const toggleCombinePartner = useCallback((partnerId: string) => {
    setState((prev) => {
      const draft = prev.draftRefillCheckout;
      if (!draft) return prev;
      const has = draft.selectedIds.includes(partnerId);
      const selectedIds = has
        ? draft.selectedIds.filter((id) => id !== partnerId)
        : [...draft.selectedIds, partnerId];
      return {
        ...prev,
        draftRefillCheckout: { ...draft, selectedIds },
      };
    });
  }, []);

  const setCombineMode = useCallback((combine: boolean) => {
    setState((prev) => {
      const draft = prev.draftRefillCheckout;
      if (!draft) return prev;
      return {
        ...prev,
        draftRefillCheckout: {
          ...draft,
          combine,
          selectedIds: combine ? draft.selectedIds : [draft.primaryId],
        },
      };
    });
  }, []);

  const completeRefillCheckout = useCallback((): RefillOrderResult => {
    let result: RefillOrderResult | null = null;
    setState((prev) => {
      const draft = prev.draftRefillCheckout;
      if (!draft) return prev;
      const includedIds = draft.combine ? draft.selectedIds : [draft.primaryId];
      const paidAmount = includedIds.reduce((sum, id) => {
        const sub = prev.subscriptions.find((s) => s.id === id);
        const product = sub ? PRODUCTS[sub.productId] : undefined;
        return sum + (product?.refillPrice ?? 0);
      }, 0);

      const order: RefillOrderResult = {
        orderNo: generateOrderNo(),
        subscriptionIds: includedIds,
        combined: draft.combine && includedIds.length > 1,
        paidAmount,
      };
      result = order;

      return {
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          includedIds.includes(s.id)
            ? {
                ...s,
                status: "pending_shipment",
                cycleProgress: 0,
                deliveryEta: "배송 준비 중",
              }
            : s,
        ),
        draftRefillCheckout: null,
        lastRefillOrder: order,
      };
    });
    return (
      result ?? {
        orderNo: generateOrderNo(),
        subscriptionIds: [],
        combined: false,
        paidAmount: 0,
      }
    );
  }, []);

  const value = useMemo<StoreApi>(
    () => ({
      ...state,
      getSubscription,
      eligibleCombinePartners,
      setDraftPurchase,
      completePurchase,
      setUsageCheck,
      changeNotifyDate,
      skipCycle,
      endSubscription,
      continueSubscription,
      startRefillCheckout,
      toggleCombinePartner,
      setCombineMode,
      completeRefillCheckout,
    }),
    [
      state,
      getSubscription,
      eligibleCombinePartners,
      setDraftPurchase,
      completePurchase,
      setUsageCheck,
      changeNotifyDate,
      skipCycle,
      endSubscription,
      continueSubscription,
      startRefillCheckout,
      toggleCombinePartner,
      setCombineMode,
      completeRefillCheckout,
    ],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export { formatWon };
