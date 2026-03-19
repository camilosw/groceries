interface SectionHeaderProps {
  title: string;
  count: number;
}

export function SectionHeader({ title, count }: SectionHeaderProps) {
  return (
    <div className="section-header">
      <span className="section-header__title">{title}</span>
      <span className="section-header__count">({count})</span>
    </div>
  );
}
