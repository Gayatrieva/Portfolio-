import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '';

export default function CertificatesWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/certificates`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Could not load certificates data.'));
  }, []);

  if (error) return <div className="win-error">{error}</div>;
  if (!data) return <div className="win-loading"><span className="spinner" />Loading…</div>;

  return (
    <div className="certs-window">
      <h1 className="win-title">Certifications</h1>
      <div className="cert-grid">
        {data.certs.map((cert) => (
          <div key={cert.name} className="cert-card">
            <div className="cert-badge" aria-hidden="true">🏅</div>
            <div className="cert-content">
              <h2 className="cert-name">{cert.name}</h2>
              <p className="cert-issuer">{cert.issuer}</p>
              <div className="cert-meta">
                <span className="tag tag-year">{cert.year}</span>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="cert-link"
                    aria-label={`View ${cert.name} certificate`}
                  >
                    View credential →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
