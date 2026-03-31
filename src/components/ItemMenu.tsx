import { useState, useRef, useEffect } from 'react';
import './ItemMenu.css';

interface ItemMenuProps {
  itemName: string;
  onDelete: () => void;
}

export function ItemMenu({ itemName, onDelete }: ItemMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  function handleDelete() {
    setMenuOpen(false);
    onDelete();
  }

  return (
    <div className="item-menu" ref={menuRef}>
      <button
        className="item-menu__trigger"
        aria-label={`Menu for ${itemName}`}
        onClick={() => setMenuOpen((v) => !v)}
      >
        ⋮
      </button>
      {menuOpen && (
        <div className="item-menu__dropdown">
          <button className="item-menu__option item-menu__option--danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
