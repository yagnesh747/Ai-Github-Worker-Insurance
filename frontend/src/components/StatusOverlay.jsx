export default function StatusOverlay({ status, result }) {
  // status: 'analyzing' | 'approved' | null
  if (!status) return null;

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        {status === 'analyzing' && (
          <div className="overlay-analyzing">
            <div className="spinner" />
            <div className="analyzing-text">Analyzing Risk…</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              AI engine evaluating environmental factors
            </div>
          </div>
        )}

        {status === 'approved' && result && (
          <>
            <div className="overlay-icon">✅</div>
            <div className="overlay-title" style={{ color: 'var(--accent-green)' }}>
              Claim Approved!
            </div>
            <div className="overlay-subtitle">
              {result.icon} {result.event}
            </div>
            <div className="overlay-payout">₹{result.payout} Credited</div>
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--accent-blue)',
              fontStyle: 'italic',
              background: 'rgba(59,130,246,0.08)',
              padding: '0.5rem',
              borderRadius: '6px',
              margin: '0.5rem 0 1rem 0'
            }}>
              "{result.explanation}"
            </div>
            <div className="overlay-claim-id">{result.claim_id}</div>
            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: 'rgba(16,185,129,0.08)',
              border: '1px solid rgba(16,185,129,0.2)',
              borderRadius: '8px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
            }}>
              Risk Score: <strong style={{ color: 'var(--accent-yellow)' }}>{result.risk_score}</strong>
              &nbsp;·&nbsp;Level: <strong style={{ color: 'var(--accent-yellow)' }}>{result.risk_level}</strong>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
