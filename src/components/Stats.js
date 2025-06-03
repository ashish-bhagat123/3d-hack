import Stats from 'stats.js';

export function setupStats() {
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: memory
  document.body.appendChild(stats.dom);
  return stats;
}