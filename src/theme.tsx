export function initTheme() {
  const saved = localStorage.getItem('theme');
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(saved === 'dark' ? 'dark' : 'light');
}

export function toggleTheme() {
  const html = document.documentElement;
  if (html.classList.contains('dark')) {
    html.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}