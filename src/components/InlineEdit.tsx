import { useEffect, useRef, useState } from 'react';

interface InlineEditProps {
  value: string;
  className?: string;
  inputClassName?: string;
  onSave: (newValue: string) => void;
  ariaLabel?: string;
}

export function InlineEdit({
  value,
  className,
  inputClassName,
  onSave,
  ariaLabel,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function enterEdit() {
    setDraft(value);
    setEditing(true);
  }

  function save() {
    onSave(draft.trim());
    setEditing(false);
  }

  function cancel() {
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        className={inputClassName}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') save();
          else if (e.key === 'Escape') cancel();
        }}
        onBlur={save}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <span
      className={className}
      role="button"
      tabIndex={0}
      onClick={enterEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') enterEdit();
      }}
      aria-label={ariaLabel}
    >
      {value}
    </span>
  );
}
