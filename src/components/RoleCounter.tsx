interface RoleCounterProps {
  value: number;
  onChange: (value: number) => void;
  max: number;
  label: string;
}

export default function RoleCounter({ value, onChange, max, label }: RoleCounterProps) {
  return (
    <div className="role-counter">
      <button type="button" aria-label={`Уменьшить: ${label}`} onClick={() => onChange(value - 1)} disabled={value <= 0}>−</button>
      <output aria-label={`Количество: ${label}`} aria-live="polite">{value}</output>
      <button type="button" aria-label={`Увеличить: ${label}`} onClick={() => onChange(value + 1)} disabled={value >= max}>+</button>
    </div>
  );
}
