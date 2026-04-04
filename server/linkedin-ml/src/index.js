const fs = require('fs');
const path = require('path');
const { parseLinkedInExport } = require('./linkedinExportParser');
const { buildFeatures } = require('./featureEngineering');
const { scoreProjects } = require('./projectScoring');
const { assignBadges } = require('./badges');
const { buildTimeline } = require('./timeline');
const { findSimilarDevelopers } = require('./similarity');

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  const raw = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, raw, 'utf8');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const next = argv[i + 1];
    if (key && key.startsWith('--')) {
      args[key.slice(2)] = next && !next.startsWith('--') ? next : true;
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);
  const outPath = args.out || 'out.json';
  const githubPath = args.github;
  const linkedinExportPath = args['linkedin-export'];
  const candidatesPath = args.candidates;

  if (!githubPath) {
    console.error('Missing --github path to GitHub JSON.');
    process.exit(1);
  }

  const githubData = readJson(githubPath);
  const linkedinData = linkedinExportPath
    ? parseLinkedInExport(linkedinExportPath)
    : null;

  const features = buildFeatures({ github: githubData, linkedin: linkedinData });
  const projectScores = scoreProjects(githubData);
  const badges = assignBadges(githubData);
  const timeline = buildTimeline({ github: githubData, linkedin: linkedinData });

  let similarity = [];
  if (candidatesPath) {
    const candidates = readJson(candidatesPath);
    similarity = findSimilarDevelopers(githubData, candidates);
  }

  const output = {
    linkedin: linkedinData,
    features,
    projectScores,
    badges,
    timeline,
    similarity
  };

  writeJson(outPath, output);
  console.log(`Wrote output to ${path.resolve(outPath)}`);
}

main();
