function MetricCard({ icon, label, value, suffix, subtext }) {
  return (
    <div className="metric-card">
      <div className="metric-card-header">
        {icon}
        <span>{label}</span>
      </div>

      <div className="metric-value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>

      {subtext && <div className="metric-subtext">{subtext}</div>}
    </div>
  )
}

export default MetricCard