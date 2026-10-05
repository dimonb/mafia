export default function Brand({ dealing = false }: { dealing?: boolean }) {
  return (
    <header className="brand">
      <span className="brand-mark" aria-hidden="true">М</span>
      <div>
        <div className="brand-name">Мафия</div>
        <div className="brand-caption">{dealing ? 'Твоя роль — твой секрет' : 'Вечер начинается здесь'}</div>
      </div>
    </header>
  );
}
