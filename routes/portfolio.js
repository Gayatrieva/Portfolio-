const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '../data');

// Helper: read JSON file with proper error handling
function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`[readData] Failed to read ${filename}:`, err.message);
    throw new Error(`Could not read data file: ${filename}`);
  }
}

// ─── Individual endpoints ─────────────────────────────────────────────────────
router.get('/about', (_req, res) => {
  try { res.json(readData('about.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/skills', (_req, res) => {
  try { res.json(readData('skills.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/projects', (_req, res) => {
  try { res.json(readData('projects.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/resume', (_req, res) => {
  try { res.json(readData('resume.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/education', (_req, res) => {
  try { res.json(readData('education.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/certificates', (_req, res) => {
  try { res.json(readData('certificates.json')); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// ─── Aggregated profile endpoint ─────────────────────────────────────────────
router.get('/profile', (_req, res) => {
  try {
    res.json({
      about:        readData('about.json'),
      skills:       readData('skills.json'),
      projects:     readData('projects.json'),
      resume:       readData('resume.json'),
      education:    readData('education.json'),
      certificates: readData('certificates.json'),
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
