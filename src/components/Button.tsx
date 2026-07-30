import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-btn bg-ink py-3.5 text-[15px] font-bold text-white transition active:opacity-80 disabled:cursor-not-allowed disabled:bg-ink-faint ${className}`}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-btn border border-ink py-3.5 text-[15px] font-bold text-ink transition active:opacity-70 ${className}`}
    />
  );
}

export function DangerGhostButton({
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={`w-full rounded-btn border border-accent py-3.5 text-[15px] font-bold text-accent transition active:opacity-70 ${className}`}
    />
  );
}

export function BottomCta({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky bottom-0 mt-auto border-t border-line bg-white px-4 pb-6 pt-3">
      {children}
    </div>
  );
}
