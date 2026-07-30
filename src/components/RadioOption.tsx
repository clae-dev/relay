interface RadioOptionProps {
  selected: boolean;
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onSelect: () => void;
}

export function RadioOption({
  selected,
  title,
  description,
  trailing,
  onSelect,
}: RadioOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-start gap-3 rounded-card border p-4 text-left transition ${
        selected
          ? "border-primary bg-primary-soft/40"
          : "border-line bg-white"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-primary" : "border-ink-faint"
        }`}
      >
        {selected && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <span className="flex-1">
        <span className="block text-[15px] font-bold text-ink">{title}</span>
        {description && (
          <span className="mt-0.5 block text-[13px] leading-snug text-ink-faint">
            {description}
          </span>
        )}
      </span>
      {trailing}
    </button>
  );
}
