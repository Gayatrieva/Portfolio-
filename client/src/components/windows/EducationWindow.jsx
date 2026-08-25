import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '';

export default function EducationWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/education`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Could not load education data.'));
  }, []);

  if (error) return <div className="win-error">{error}</div>;
  if (!data) return <div className="win-loading"><span className="spinner" />Loading…</div>;

  return (
    <div className="education-window">
      <h1 className="win-title">Education</h1>
      <div className="edu-list">
        {data.degrees.map((deg) => (
          <div key={`${deg.school}-${deg.degree}`} className="edu-card">
            <div className="edu-icon" aria-hidden="true">🎓</div>
            <div className="edu-content">
              <h2 className="edu-degree">{deg.degree}</h2>
              <p className="edu-school">{deg.school}</p>
              <div className="edu-meta">
                <span className="tag tag-year">{deg.year}</span>
                {deg.gpa && <span className="tag tag-gpa">GPA {deg.gpa}</span>}
              </div>
              {deg.notes && <p className="edu-notes">{deg.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
