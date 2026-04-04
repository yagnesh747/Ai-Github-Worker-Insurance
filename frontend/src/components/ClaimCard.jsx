export default function ClaimCard({ claim }) {
  const date = new Date(claim.timestamp + 'Z');
  const formatted = date.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="claim-item">
      <div className="claim-icon">{claim.icon}</div>
      <div className="claim-info">
        <div className="claim-event">{claim.event}</div>
        <div className="claim-meta">
          {claim.claim_id} · {formatted} · Risk: {claim.risk_level}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontStyle: 'italic' }}>
          AI Reasoning: {claim.explanation}
        </div>
      </div>
      <div>
        <div className="claim-amount">+₹{claim.payout}</div>
        <div className="claim-status">✅ {claim.status}</div>
      </div>
    </div>
  );
}
