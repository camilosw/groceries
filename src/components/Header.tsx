import './Header.css';

interface HeaderProps {
  title?: string;
}

export function Header({ title = 'Grocery List' }: HeaderProps) {
  return (
    <header className="app-header">
      <span className="app-header__icon">🛒</span>
      <div className="app-header__title">{title}</div>
    </header>
  );
}
