import { parseState } from './storage';
import type { GroceryState } from './storage';

/** Downloads the current state as a dated JSON backup file. */
export function exportState(state: GroceryState): void {
  const blob = new Blob([JSON.stringify(state)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `groceries-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Reads a backup file picked by the user. Returns null when it is not a valid backup. */
export async function readBackupFile(file: File): Promise<GroceryState | null> {
  try {
    return parseState(await file.text());
  } catch {
    return null;
  }
}
