const fs = require('fs');
const path = require('path');

function parseCsv(content) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i += 1) {
    const ch = content[i];
    const next = content[i + 1];

    if (ch === '"') {
      if (inQuotes && next === '"') {
        cell += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
      continue;
    }

    if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (cell.length || row.length) {
        row.push(cell);
        rows.push(row);
        row = [];
        cell = '';
      }
      if (ch === '\r' && next === '\n') {
        i += 1;
      }
      continue;
    }

    cell += ch;
  }

  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }

  if (rows.length === 0) {
    return [];
  }

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cols) => {
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (cols[idx] || '').trim();
    });
    return obj;
  });
}

function readCsvIfExists(exportPath, fileName) {
  const filePath = path.join(exportPath, fileName);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return parseCsv(raw);
}

function parseLinkedInExport(exportPath) {
  const profile = readCsvIfExists(exportPath, 'Profile.csv');
  const positions = readCsvIfExists(exportPath, 'Positions.csv');
  const education = readCsvIfExists(exportPath, 'Education.csv');
  const skills = readCsvIfExists(exportPath, 'Skills.csv');

  return {
    profile: profile[0] || null,
    positions,
    education,
    skills
  };
}

module.exports = {
  parseLinkedInExport
};
