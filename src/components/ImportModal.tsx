import { useEffect } from 'react';
import type { GroceryState } from '../store/storage';
import './ImportModal.css';

interface ImportModalProps {
  fileName: string;
  /** Parsed backup, or null when the file could not be read. */
  state: GroceryState | null;
  onCancel: () => void;
  onConfirm: (state: GroceryState) => void;
}

export function ImportModal({
  fileName,
  state,
  onCancel,
  onConfirm,
}: ImportModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onCancel();
  }

  const toBuy = state?.items.filter((item) => !item.bought).length ?? 0;

  return (
    <div className="import-overlay" onClick={handleOverlayClick}>
      <div className="import-card" role="dialog" aria-label="Import data">
        <h2 className="import-title">Import data</h2>
        <p className="import-file">{fileName}</p>
        {state ? (
          <>
            <p className="import-summary">
              {state.items.length} items · {toBuy} to buy
            </p>
            <p className="import-warning">This replaces your current list.</p>
            <div className="import-actions">
              <button className="import-btn" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="import-btn import-btn--primary"
                onClick={() => onConfirm(state)}
              >
                Replace
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="import-error">
              This file isn't a valid grocery backup.
            </p>
            <div className="import-actions">
              <button
                className="import-btn import-btn--primary"
                onClick={onCancel}
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
