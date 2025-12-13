export function downloadJSON(config, filename) {
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportMatchesJSON(config) {
  downloadJSON(config, `ftc-auto-all-matches-${Date.now()}.json`);
}

export function exportConfigJSON(config) {
  downloadJSON(config, `ftc-config-${Date.now()}.json`);
}
