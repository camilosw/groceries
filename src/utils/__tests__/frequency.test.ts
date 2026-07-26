import { describe, it, expect } from 'vitest';
import {
  frequencyScore,
  purchaseInterval,
  daysUntilNextPurchase,
  purchaseUrgency,
  pruneHistory,
} from '../frequency';

const DAY = 1000 * 60 * 60 * 24;
const NOW = 1_000_000 * DAY; // arbitrary fixed "now"

describe('frequencyScore', () => {
  it('returns 0 for empty history', () => {
    expect(frequencyScore([], NOW)).toBe(0);
  });

  it('returns ~1 for a purchase today', () => {
    const score = frequencyScore([NOW], NOW);
    expect(score).toBeCloseTo(1, 5);
  });

  it('returns ~0.5 for a purchase 30 days ago (half-life)', () => {
    const score = frequencyScore([NOW - 30 * DAY], NOW);
    expect(score).toBeCloseTo(0.5, 5);
  });

  it('scores a recent purchase higher than an old one', () => {
    const recent = frequencyScore([NOW - 5 * DAY], NOW);
    const old = frequencyScore([NOW - 60 * DAY], NOW);
    expect(recent).toBeGreaterThan(old);
  });

  it('accumulates scores for multiple purchases', () => {
    const single = frequencyScore([NOW], NOW);
    const double = frequencyScore([NOW, NOW], NOW);
    expect(double).toBeCloseTo(single * 2, 5);
  });
});

describe('purchaseInterval', () => {
  it('returns null for empty history', () => {
    expect(purchaseInterval([])).toBeNull();
  });

  it('returns null for a single purchase', () => {
    expect(purchaseInterval([NOW])).toBeNull();
  });

  it('returns the gap in days for two purchases', () => {
    const interval = purchaseInterval([NOW - 10 * DAY, NOW]);
    expect(interval).toBeCloseTo(10, 5);
  });

  it('returns the median gap for an odd number of gaps', () => {
    // gaps: 5d, 10d, 15d → median = 10d
    const history = [NOW - 30 * DAY, NOW - 25 * DAY, NOW - 15 * DAY, NOW];
    const interval = purchaseInterval(history);
    expect(interval).toBeCloseTo(10, 5);
  });

  it('returns the average of two middle gaps for an even number of gaps', () => {
    // gaps: 5d, 15d → median = 10d
    const history = [NOW - 20 * DAY, NOW - 15 * DAY, NOW];
    const interval = purchaseInterval(history);
    expect(interval).toBeCloseTo(10, 5);
  });

  it('handles unsorted timestamps', () => {
    const interval = purchaseInterval([NOW, NOW - 7 * DAY]);
    expect(interval).toBeCloseTo(7, 5);
  });
});

describe('daysUntilNextPurchase', () => {
  const history = [NOW - 40 * DAY, NOW - 30 * DAY]; // 10-day interval, last purchase at NOW - 30 * DAY

  it('returns null for fewer than 2 purchases', () => {
    expect(daysUntilNextPurchase([])).toBeNull();
    expect(daysUntilNextPurchase([NOW])).toBeNull();
  });

  it('returns the full interval when the last purchase was just now', () => {
    expect(daysUntilNextPurchase(history, NOW - 30 * DAY)).toBeCloseTo(10, 5);
  });

  it('counts down as time passes without a new purchase (not yet due)', () => {
    expect(daysUntilNextPurchase(history, NOW - 26 * DAY)).toBeCloseTo(6, 5);
  });

  it('goes negative once the item is overdue', () => {
    expect(daysUntilNextPurchase(history, NOW - 15 * DAY)).toBeCloseTo(-5, 5);
  });
});

describe('purchaseUrgency', () => {
  it('returns "ok" when there is still time', () => {
    expect(purchaseUrgency(3)).toBe('ok');
  });

  it('returns "today" when due today (rounds to 0)', () => {
    expect(purchaseUrgency(0.4)).toBe('today');
    expect(purchaseUrgency(-0.4)).toBe('today');
  });

  it('returns "overdue" when past due', () => {
    expect(purchaseUrgency(-5)).toBe('overdue');
  });
});

describe('pruneHistory', () => {
  it('keeps timestamps within 180 days', () => {
    const ts = NOW - 100 * DAY;
    expect(pruneHistory([ts], NOW)).toEqual([ts]);
  });

  it('removes timestamps older than 180 days', () => {
    const ts = NOW - 181 * DAY;
    expect(pruneHistory([ts], NOW)).toEqual([]);
  });

  it('keeps the boundary at exactly 180 days', () => {
    const ts = NOW - 180 * DAY;
    expect(pruneHistory([ts], NOW)).toEqual([ts]);
  });

  it('returns empty array for empty history', () => {
    expect(pruneHistory([], NOW)).toEqual([]);
  });

  it('keeps recent entries and drops old ones', () => {
    const old = NOW - 200 * DAY;
    const recent = NOW - 50 * DAY;
    expect(pruneHistory([old, recent], NOW)).toEqual([recent]);
  });
});
