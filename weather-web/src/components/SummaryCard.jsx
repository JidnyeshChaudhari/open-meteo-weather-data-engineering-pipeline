function SummaryCard({ icon, label, value, suffix, subtext }) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        {icon}
        <span>{label}</span>
      </div>

      <div className="summary-value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>

      {subtext && <div className="summary-subtext">{subtext}</div>}
    </div>
  )
}

export default SummaryCard