import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '';

export default function ProjectsWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/projects`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Could not load project data.'));
  }, []);

  if (error) return <div className="win-error">{error}</div>;
  if (!data) return <div className="win-loading"><span className="spinner" />Loading…</div>;

  return (
    <div className="projects-window">
      <h1 className="win-title">Projects</h1>
      <div className="project-list">
        {data.projects.map((project, i) => {
          const isExpanded = expanded === i;
          return (
            <article key={project.title} className="project-card">
              <div className="project-header">
                <div className="project-info">
                  <h2 className="project-title">{project.title}</h2>
                  <p className="project-desc">{project.description}</p>
                </div>
                <button
                  className="project-expand-btn"
                  onClick={() => setExpanded(isExpanded ? null : i)}
                  aria-expanded={isExpanded}
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${project.title} details`}
                >
                  {isExpanded ? '−' : '+'}
                </button>
              </div>

              <div className="tag-row project-stack">
                {project.stack.map((tech) => (
                  <span key={tech} className="tag tag-tech">{tech}</span>
                ))}
              </div>

              {isExpanded && project.highlights?.length > 0 && (
                <ul className="project-highlights">
                  {project.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              )}

              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="project-link"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  → view project
                </a>
              )}

              {i < data.projects.length - 1 && <hr className="project-divider" />}
            </article>
          );
        })}
      </div>
    </div>
  );
}
