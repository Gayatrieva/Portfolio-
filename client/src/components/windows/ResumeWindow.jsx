import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '';

export default function ResumeWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  useEffect(() => {
    fetch(`${API}/api/resume`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Could not load resume data.'));
  }, []);

  if (error) return <div className="win-error">{error}</div>;
  if (!data) return <div className="win-loading"><span className="spinner" />Loading…</div>;

  return (
    <div className="resume-window">
      <div className="resume-tabs">
        <button
          className={`resume-tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
          id="tab-timeline"
          aria-selected={activeTab === 'timeline'}
          role="tab"
        >
          Timeline
        </button>
        <button
          className={`resume-tab ${activeTab === 'pdf' ? 'active' : ''}`}
          onClick={() => setActiveTab('pdf')}
          id="tab-pdf"
          aria-selected={activeTab === 'pdf'}
          role="tab"
        >
          PDF
        </button>
      </div>

      {activeTab === 'timeline' && (
        <div className="resume-timeline" role="tabpanel" aria-labelledby="tab-timeline">
          <h1 className="win-title">Experience</h1>
          <ol className="timeline-list">
            {data.experience.map((job, i) => (
              <li key={`${job.company}-${i}`} className="timeline-item">
                <div className="timeline-dot" aria-hidden="true" />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h2 className="timeline-role">{job.role}</h2>
                    <span className="timeline-dates">
                      {job.start} – {job.end}
                    </span>
                  </div>
                  <p className="timeline-company">{job.company}</p>
                  <p className="timeline-summary">{job.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {activeTab === 'pdf' && (
        <div
          className="resume-pdf-view"
          role="tabpanel"
          aria-labelledby="tab-pdf"
        >
          <embed
            src="\Gayatri_Kashyap__Resume.pdf"
            type="application/pdf"
            className="pdf-embed"
            title="Gayatri Resume"
            aria-label="Resume document"
          />
        </div>
      )}
    </div>
  );
}
