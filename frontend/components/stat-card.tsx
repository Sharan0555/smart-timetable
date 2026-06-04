export function StatCard({
  title,
  value,
  subtitle
}: {
  title: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <p className="muted">{subtitle}</p>
    </div>
  );
}
