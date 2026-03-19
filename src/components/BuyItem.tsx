import { purchaseInterval } from '../utils/frequency';
import type { GroceryItem } from '../types';
import { useGroceries } from '../store/grocery-context';

interface BuyItemProps {
  item: GroceryItem;
}

export function BuyItem({ item }: BuyItemProps) {
  const { dispatch } = useGroceries();
  const interval = purchaseInterval(item.purchaseHistory);

  return (
    <div className="buy-item">
      <input
        type="checkbox"
        className="buy-item__checkbox"
        checked={false}
        onChange={() => dispatch({ type: 'CHECK_ITEM', id: item.id })}
        aria-label={`Mark ${item.name} as purchased`}
      />
      <span className="buy-item__name">{item.name}</span>
      {interval !== null && (
        <span className="buy-item__badge">c/{Math.round(interval)}d</span>
      )}
    </div>
  );
}
