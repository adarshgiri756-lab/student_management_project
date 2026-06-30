const DashboardCard = ({ title, value, tone = 'purple', hint }) => (
  <article className={`stat-card tone-${tone}`}>
    <span>{title}</span>
    <strong>{value ?? 0}</strong>
    {hint && <small>{hint}</small>}
  </article>
);

export default DashboardCard;
