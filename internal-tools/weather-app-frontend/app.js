const API_BASE = new URLSearchParams(window.location.search).get('api') || 'http://127.0.0.1:8000';
const CITY_NAMES = { 'sao-manuel': 'São Manuel', barretos: 'Barretos', botucatu: 'Botucatu' };
const state = { city: 'sao-manuel', selectedDay: 'today', forecast: null, updatedAt: null };
const $ = (selector) => document.querySelector(selector);
const citySelect = $('#city-select');
const errorBanner = $('#error-banner');
const loading = $('#loading');
const content = $('#forecast-content');

function number(value, digits = 0) {
  return value == null || !Number.isFinite(Number(value)) ? '—' : Number(value).toFixed(digits);
}

function formatDate(timestamp, options) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : new Intl.DateTimeFormat(undefined, options).format(date);
}

function labelForDay(day) {
  return day === 'today' ? 'Today' : 'Tomorrow';
}

function currentHourKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}`;
}

function renderSummary(dayData) {
  const summary = dayData.summary;
  const temp = summary.temperature_c || {};
  const probability = summary.precipitation_probability_percent || {};
  const rain = dayData.hourly.reduce((total, point) => total + (Number(point.precipitation_mm) || 0), 0);
  const cards = [
    { tone: 'sun', icon: '☀', label: 'TEMPERATURE', value: number(temp.average, 1), unit: '°C avg', detail: `Low ${number(temp.min, 1)}° · High ${number(temp.max, 1)}°` },
    { tone: 'sky', icon: '☁', label: 'RAIN PROBABILITY', value: number(probability.average), unit: '% avg', detail: `Low ${number(probability.min)}% · High ${number(probability.max)}%` },
    { tone: 'rain', icon: '☂', label: 'TOTAL RAINFALL', value: number(rain, 1), unit: 'mm', detail: 'Accumulated across the day' },
    { tone: 'mist', icon: '〰', label: 'HOURLY RAINFALL', value: number(summary.precipitation_mm?.average, 1), unit: 'mm avg', detail: `Low ${number(summary.precipitation_mm?.min, 1)} · High ${number(summary.precipitation_mm?.max, 1)} mm` },
  ];
  $('#summary-grid').innerHTML = cards.map((card) => `<article class="summary-card tone-${card.tone}"><span class="metric-icon" aria-hidden="true">${card.icon}</span><div class="metric-label">${card.label}</div><div class="metric-main"><span class="metric-value">${card.value}</span><span class="metric-unit">${card.unit}</span></div><div class="metric-detail">${card.detail}</div></article>`).join('');
}

function chartSvg(points, compact = false, filled = false) {
  if (!points.length) return '<div class="empty-chart">Forecast data is not available yet.</div>';
  const width = 720;
  const height = compact ? 180 : 218;
  const margin = { top: 14, right: 34, bottom: 32, left: 34 };
  const innerW = width - margin.left - margin.right;
  const innerH = height - margin.top - margin.bottom;
  const temps = points.map((point) => Number(point.temperature_c)).filter(Number.isFinite);
  const rains = points.map((point) => Number(point.precipitation_mm)).filter(Number.isFinite);
  let minT = Math.min(...temps, 0);
  let maxT = Math.max(...temps, 10);
  const range = Math.max(1, maxT - minT);
  minT -= range * 0.12;
  maxT += range * 0.12;
  const maxRain = Math.max(1, ...rains);
  const x = (index) => margin.left + (points.length <= 1 ? innerW / 2 : index * innerW / (points.length - 1));
  const yTemp = (value) => margin.top + (maxT - value) / (maxT - minT) * innerH;
  const yRain = (value) => margin.top + innerH - value / maxRain * innerH;
  const tickIndices = [...new Set([0, Math.floor((points.length - 1) / 3), Math.floor((points.length - 1) * 2 / 3), points.length - 1])];
  const grid = [0, 1, 2].map((index) => {
    const y = margin.top + index * innerH / 2;
    const tempTick = maxT - index * (maxT - minT) / 2;
    return `<g><line x1="${margin.left}" y1="${y}" x2="${width - margin.right}" y2="${y}" stroke="#edf0eb" stroke-dasharray="3 5"/><text x="${margin.left - 8}" y="${y + 3}" text-anchor="end" fill="#9aa39d" font-size="9">${tempTick.toFixed(0)}°</text></g>`;
  }).join('');
  const bars = points.map((point, index) => {
    const value = Number(point.precipitation_mm) || 0;
    const barW = Math.max(3, Math.min(12, innerW / points.length * 0.48));
    const barY = yRain(value);
    const barH = Math.max(0, margin.top + innerH - barY);
    return value > 0 ? `<rect x="${x(index) - barW / 2}" y="${barY}" width="${barW}" height="${barH}" rx="2" fill="#a7c5d7" opacity=".78"><title>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}: ${value} mm rainfall</title></rect>` : '';
  }).join('');
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${yTemp(Number(point.temperature_c) || 0).toFixed(1)}`).join(' ');
  const area = filled ? `<path d="${line} L${x(points.length - 1).toFixed(1)},${(margin.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(margin.top + innerH).toFixed(1)} Z" fill="url(#temperature-area)"/>` : '';
  const gradient = filled ? '<defs><linearGradient id="temperature-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#75a183" stop-opacity=".30"/><stop offset="100%" stop-color="#75a183" stop-opacity=".025"/></linearGradient></defs>' : '';
  const dots = points.map((point, index) => `<circle cx="${x(index)}" cy="${yTemp(Number(point.temperature_c) || 0)}" r="${compact ? 2.2 : 2.7}" fill="#28634f"><title>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}: ${number(point.temperature_c, 1)}°C</title></circle>`).join('');
  const labels = tickIndices.map((index) => `<text x="${x(index)}" y="${height - 8}" text-anchor="middle" fill="#929c94" font-size="9">${formatDate(points[index].time, { hour: '2-digit' })}</text>`).join('');
  const rainLabel = `<text x="${width - margin.right + 7}" y="${margin.top + 5}" text-anchor="start" fill="#9aa39d" font-size="8">${number(maxRain, 0)} mm</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Hourly temperature and rainfall chart"><title>Hourly temperature and rainfall</title>${gradient}${grid}${bars}${area}<path d="${line}" fill="none" stroke="#28634f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}${labels}${rainLabel}</svg>`;
}

function renderTable(dayData, selectedDay) {
  const nowKey = selectedDay === 'today' ? currentHourKey() : '';
  $('#hourly-rows').innerHTML = dayData.hourly.map((point) => {
    const timeKey = String(point.time).slice(0, 13);
    const active = timeKey === nowKey;
    return `<tr class="${active ? 'current-hour' : ''}"${active ? ' aria-current="time"' : ''}><td>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}${active ? ' · NOW' : ''}</td><td class="temp-cell">${number(point.temperature_c, 1)}°C</td><td class="rain-cell">${number(point.precipitation_probability_percent)}%</td><td>${number(point.precipitation_mm, 1)} mm</td></tr>`;
  }).join('');
}

function render() {
  if (!state.forecast) return;
  const selected = state.forecast[state.selectedDay];
  const city = CITY_NAMES[state.city];
  const selectedLabel = labelForDay(state.selectedDay);
  $('#main-chart-kicker').textContent = `${selectedLabel.toUpperCase()} · HOURLY`;
  $('#main-chart-title').textContent = state.selectedDay === 'today' ? 'The day ahead' : 'Tomorrow, hour by hour';
  $('#main-chart').innerHTML = chartSvg(selected.hourly, false, true);
  $('#table-kicker').textContent = `${selectedLabel.toUpperCase()} · HOUR BY HOUR`;
  $('#footer-location').textContent = `${city} · times shown in local time`;
  $('#updated-at').textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(state.updatedAt)}`;
  document.querySelectorAll('.day-tab').forEach((button) => {
    const active = button.dataset.day === state.selectedDay;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  renderSummary(selected);
  renderTable(selected, state.selectedDay);
}

async function loadForecast() {
  state.city = citySelect.value;
  loading.hidden = false;
  content.hidden = true;
  errorBanner.hidden = true;
  try {
    const response = await fetch(`${API_BASE.replace(/\/$/, '')}/${encodeURIComponent(state.city)}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Weather API returned ${response.status}${response.status === 404 ? ' for this city' : ''}.`);
    const data = await response.json();
    if (!data.today?.hourly || !data.tomorrow?.hourly || !data.today?.summary || !data.tomorrow?.summary) throw new Error('The API response is missing today or tomorrow forecast data.');
    state.forecast = data;
    state.updatedAt = new Date();
    render();
    loading.hidden = true;
    content.hidden = false;
  } catch (error) {
    loading.hidden = true;
    errorBanner.textContent = `${error.message} Check that the weather API is running at ${API_BASE}. If this page is hosted on a different origin, the API must allow browser requests from it (CORS).`;
    errorBanner.hidden = false;
  }
}

citySelect.addEventListener('change', loadForecast);
document.querySelectorAll('.day-tab').forEach((button) => button.addEventListener('click', () => {
  if (state.selectedDay === button.dataset.day) return;
  state.selectedDay = button.dataset.day;
  render();
}));
window.setInterval(() => {
  if (state.forecast && state.selectedDay === 'today') renderTable(state.forecast.today, 'today');
}, 60_000);
loadForecast();
