import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || '';

const CATEGORY_ICONS = {
  Languages: '',
  Frontend: '◈',
  Backend: '⚙',
  'Auth & Security': '🔐',
  'Databases & Tools': '⬡',
  'Core Concepts': '✦',
};

export default function SkillsWindow() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/skills`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setError('Could not load skills data.'));
  }, []);

  if (error) return <div className="win-error">{error}</div>;
  if (!data) return <div className="win-loading"><span className="spinner" />Loading…</div>;

  return (
    <div className="skills-window">
      <h1 className="win-title">Technical Skills</h1>
      <div className="skills-grid">
        {data.categories.map((cat) => (
          <div key={cat.name} className="skill-category">
            <div className="skill-cat-header">
              <span className="skill-cat-icon" aria-hidden="true">
                {CATEGORY_ICONS[cat.name] || '◆'}
              </span>
              <h2 className="skill-cat-name">{cat.name}</h2>
            </div>
            <div className="tag-row">
              {cat.items.map((item) => (
                <span key={item} className="tag tag-skill">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
