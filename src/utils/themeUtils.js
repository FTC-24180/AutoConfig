export function getThemeForAlliance(alliance, isDarkTheme) {
  if (alliance === 'red') {
    return isDarkTheme
      ? { from: '#3f1d1d', to: '#111827', accent: '#f87171' }
      : { from: '#fff5f5', to: '#fff1f2', accent: '#ef4444' };
  } else {
    return isDarkTheme
      ? { from: '#1E3A78', to: '#0f172a', accent: '#60a5fa' }
      : { from: '#dbeafe', to: '#e0e7ff', accent: '#3b82f6' };
  }
}
