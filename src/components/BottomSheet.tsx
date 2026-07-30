"use client";

import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-30 flex items-end">
      <button
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/45"
      />
      <div className="relative z-10 max-h-[85%] w-full overflow-y-auto rounded-t-[24px] bg-white px-5 pb-6 pt-3 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-line" />
        {children}
      </div>
    </div>
  );
}
