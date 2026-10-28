const API_BASE = new URLSearchParams(window.location.search).get('api') || '/api';
const CITY_NAMES = { 'sao-manuel': 'São Manuel', barretos: 'Barretos', botucatu: 'Botucatu' };
const translations = {
  'pt-BR': {
    eyebrow: 'Uma visão clara das próximas horas', title: 'Previsão do tempo<span class="title-period">.</span>', intro: 'Temperatura e chuva, hora a hora.', languageLabel: 'IDIOMA', languageSelectLabel: 'Idioma', locationLabel: 'LOCAL', loading: 'Carregando a previsão', dayNavLabel: 'Dia da previsão', today: 'Hoje', tomorrow: 'Amanhã', summaryLabel: 'Resumo do dia selecionado', forecastLabel: 'Gráfico e tabela da previsão por hora', chartBadge: 'VISÃO DE 24 HORAS', temperature: 'Temperatura', rainfall: 'Chuva', chartNote: 'Temperatura em °C · chuva em mm por hora', hourlyLabel: 'Previsão por hora', hourlyTitle: 'Previsão por hora', currentHour: 'Hora atual', localTime: 'Hora local', rainChance: 'Chance de chuva', provider: 'Previsão fornecida por Open-Meteo', avg: 'méd.', low: 'Mín.', high: 'Máx.', totalRain: 'CHUVA TOTAL', hourlyRain: 'CHUVA POR HORA', accumulated: 'Acumulado no dia', average: 'média', dayAhead: 'Previsão do dia', tomorrowHours: 'Amanhã, hora a hora', dayHourly: 'POR HORA', dayByDay: 'HORA A HORA', updated: 'Atualizado às', localTimes: 'horários locais', now: 'AGORA', emptyChart: 'Previsão ainda não disponível.', chartAria: 'Gráfico de temperatura e chuva por hora', rainfallTitle: 'chuva', temperatureTitle: 'temperatura', apiError: 'A API de clima retornou', cityError: ' para esta cidade', missingData: 'A resposta da API não contém a previsão de hoje ou de amanhã.', apiHelp: 'Verifique se a API está em execução em', corsHelp: 'Se esta página estiver hospedada em outro endereço, a API precisa permitir solicitações do navegador (CORS).', unknownError: 'Não foi possível carregar a previsão.'
  },
  'en-US': {
    eyebrow: 'A clearer look at the hours ahead', title: 'Weather, at a glance<span class="title-period">.</span>', intro: 'Temperature and rainfall forecasts, hour by hour.', languageLabel: 'LANGUAGE', languageSelectLabel: 'Language', locationLabel: 'LOCATION', loading: 'Loading the forecast', dayNavLabel: 'Forecast day', today: 'Today', tomorrow: 'Tomorrow', summaryLabel: 'Selected day summary', forecastLabel: 'Hourly weather chart and forecast table', chartBadge: '24 HOUR VIEW', temperature: 'Temperature', rainfall: 'Rainfall', chartNote: 'Temperature in °C · rainfall in mm per hour', hourlyLabel: 'Hourly forecast', hourlyTitle: 'Hourly forecast', currentHour: 'Current hour', localTime: 'LOCAL TIME', rainChance: 'Rain chance', provider: 'Forecast provided by Open-Meteo', avg: 'avg', low: 'Low', high: 'High', totalRain: 'TOTAL RAINFALL', hourlyRain: 'HOURLY RAINFALL', accumulated: 'Accumulated across the day', average: 'average', dayAhead: 'The day ahead', tomorrowHours: 'Tomorrow, hour by hour', dayHourly: 'HOURLY', dayByDay: 'HOUR BY HOUR', updated: 'Updated', localTimes: 'times shown in local time', now: 'NOW', emptyChart: 'Forecast data is not available yet.', chartAria: 'Hourly temperature and rainfall chart', rainfallTitle: 'rainfall', temperatureTitle: 'temperature', apiError: 'Weather API returned', cityError: ' for this city', missingData: 'The API response is missing today or tomorrow forecast data.', apiHelp: 'Check that the weather API is running at', corsHelp: 'If this page is hosted on a different origin, the API must allow browser requests from it (CORS).', unknownError: 'Unable to load the forecast.'
  }
};
const query = new URLSearchParams(window.location.search);
const state = { city: 'sao-manuel', selectedDay: 'today', language: query.get('lang') === 'en-US' ? 'en-US' : 'pt-BR', forecast: null, updatedAt: null };
const $ = (selector) => document.querySelector(selector);
const citySelect = $('#city-select');
const languageSelect = $('#language-select');
const errorBanner = $('#error-banner');
const loading = $('#loading');
const content = $('#forecast-content');

function number(value, digits = 0) {
  return value == null || !Number.isFinite(Number(value)) ? '—' : new Intl.NumberFormat(state.language, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(Number(value));
}

function t(key) { return translations[state.language][key]; }

function formatDate(timestamp, options) {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? timestamp : new Intl.DateTimeFormat(state.language, options).format(date);
}

function labelForDay(day) {
  return day === 'today' ? t('today') : t('tomorrow');
}

function applyLanguage() {
  const dictionary = translations[state.language];
  document.documentElement.lang = state.language;
  document.title = state.language === 'pt-BR' ? 'Clima em foco' : 'Weather Outlook';
  languageSelect.value = state.language;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value != null) element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((element) => {
    element.setAttribute('aria-label', dictionary[element.dataset.i18nAria]);
  });
  citySelect.setAttribute('aria-label', state.language === 'pt-BR' ? 'Escolha uma cidade' : 'Choose a city');
  if (state.forecast) render();
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
    { tone: 'sun', icon: '☀', label: t('temperature').toLocaleUpperCase(state.language), value: number(temp.average, 1), unit: `°C ${t('avg')}`, detail: `${t('low')} ${number(temp.min, 1)}° · ${t('high')} ${number(temp.max, 1)}°` },
    { tone: 'sky', icon: '☁', label: state.language === 'pt-BR' ? 'CHANCE DE CHUVA' : 'RAIN PROBABILITY', value: number(probability.average), unit: `% ${t('avg')}`, detail: `${t('low')} ${number(probability.min)}% · ${t('high')} ${number(probability.max)}%` },
    { tone: 'rain', icon: '☂', label: t('totalRain'), value: number(rain, 1), unit: 'mm', detail: t('accumulated') },
    { tone: 'mist', icon: '〰', label: t('hourlyRain'), value: number(summary.precipitation_mm?.average, 1), unit: `mm ${t('avg')}`, detail: `${t('low')} ${number(summary.precipitation_mm?.min, 1)} · ${t('high')} ${number(summary.precipitation_mm?.max, 1)} mm` },
  ];
  $('#summary-grid').innerHTML = cards.map((card) => `<article class="summary-card tone-${card.tone}"><span class="metric-icon" aria-hidden="true">${card.icon}</span><div class="metric-label">${card.label}</div><div class="metric-main"><span class="metric-value">${card.value}</span><span class="metric-unit">${card.unit}</span></div><div class="metric-detail">${card.detail}</div></article>`).join('');
}

function chartSvg(points, compact = false, filled = false) {
  if (!points.length) return `<div class="empty-chart">${t('emptyChart')}</div>`;
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
    return value > 0 ? `<rect x="${x(index) - barW / 2}" y="${barY}" width="${barW}" height="${barH}" rx="2" fill="#a7c5d7" opacity=".78"><title>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}: ${number(value, 1)} mm ${t('rainfallTitle')}</title></rect>` : '';
  }).join('');
  const line = points.map((point, index) => `${index ? 'L' : 'M'}${x(index).toFixed(1)},${yTemp(Number(point.temperature_c) || 0).toFixed(1)}`).join(' ');
  const area = filled ? `<path d="${line} L${x(points.length - 1).toFixed(1)},${(margin.top + innerH).toFixed(1)} L${x(0).toFixed(1)},${(margin.top + innerH).toFixed(1)} Z" fill="url(#temperature-area)"/>` : '';
  const gradient = filled ? '<defs><linearGradient id="temperature-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#75a183" stop-opacity=".30"/><stop offset="100%" stop-color="#75a183" stop-opacity=".025"/></linearGradient></defs>' : '';
  const dots = points.map((point, index) => `<circle cx="${x(index)}" cy="${yTemp(Number(point.temperature_c) || 0)}" r="${compact ? 2.2 : 2.7}" fill="#28634f"><title>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}: ${number(point.temperature_c, 1)}°C ${t('temperatureTitle')}</title></circle>`).join('');
  const labels = tickIndices.map((index) => `<text x="${x(index)}" y="${height - 8}" text-anchor="middle" fill="#929c94" font-size="9">${formatDate(points[index].time, { hour: '2-digit' })}</text>`).join('');
  const rainLabel = `<text x="${width - margin.right + 7}" y="${margin.top + 5}" text-anchor="start" fill="#9aa39d" font-size="8">${number(maxRain, 0)} mm</text>`;
  return `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${t('chartAria')}"><title>${t('chartAria')}</title>${gradient}${grid}${bars}${area}<path d="${line}" fill="none" stroke="#28634f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>${dots}${labels}${rainLabel}</svg>`;
}

function renderTable(dayData, selectedDay) {
  const nowKey = selectedDay === 'today' ? currentHourKey() : '';
  $('#hourly-rows').innerHTML = dayData.hourly.map((point) => {
    const timeKey = String(point.time).slice(0, 13);
    const active = timeKey === nowKey;
    return `<tr class="${active ? 'current-hour' : ''}"${active ? ' aria-current="time"' : ''}><td>${formatDate(point.time, { hour: '2-digit', minute: '2-digit' })}${active ? ` · ${t('now')}` : ''}</td><td class="temp-cell" data-label="${t('temperature')}">${number(point.temperature_c, 1)}°C</td><td class="rain-cell" data-label="${t('rainChance')}">${number(point.precipitation_probability_percent)}%</td><td data-label="${t('rainfall')}">${number(point.precipitation_mm, 1)} mm</td></tr>`;
  }).join('');
}

function render() {
  if (!state.forecast) return;
  const selected = state.forecast[state.selectedDay];
  const city = CITY_NAMES[state.city];
  const selectedLabel = labelForDay(state.selectedDay);
  $('#main-chart-kicker').textContent = `${selectedLabel.toLocaleUpperCase(state.language)} · ${t('dayHourly')}`;
  $('#main-chart-title').textContent = state.selectedDay === 'today' ? t('dayAhead') : t('tomorrowHours');
  $('#main-chart').innerHTML = chartSvg(selected.hourly, false, true);
  $('#table-kicker').textContent = `${selectedLabel.toLocaleUpperCase(state.language)} · ${t('dayByDay')}`;
  $('#footer-location').textContent = `${city} · ${t('localTimes')}`;
  $('#updated-at').textContent = `${t('updated')} ${new Intl.DateTimeFormat(state.language, { hour: '2-digit', minute: '2-digit' }).format(state.updatedAt)}`;
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
    if (!response.ok) throw new Error(`${t('apiError')} ${response.status}${response.status === 404 ? t('cityError') : ''}.`);
    const data = await response.json();
    if (!data.today?.hourly || !data.tomorrow?.hourly || !data.today?.summary || !data.tomorrow?.summary) throw new Error(t('missingData'));
    state.forecast = data;
    state.updatedAt = new Date();
    render();
    loading.hidden = true;
    content.hidden = false;
  } catch (error) {
    loading.hidden = true;
    errorBanner.textContent = `${error.message || t('unknownError')} ${t('apiHelp')} ${API_BASE}. ${t('corsHelp')}`;
    errorBanner.hidden = false;
  }
}

citySelect.addEventListener('change', loadForecast);
languageSelect.addEventListener('change', () => {
  state.language = languageSelect.value;
  query.set('lang', state.language);
  const search = query.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`);
  applyLanguage();
});
document.querySelectorAll('.day-tab').forEach((button) => button.addEventListener('click', () => {
  if (state.selectedDay === button.dataset.day) return;
  state.selectedDay = button.dataset.day;
  render();
}));
applyLanguage();
window.setInterval(() => {
  if (state.forecast && state.selectedDay === 'today') renderTable(state.forecast.today, 'today');
}, 60_000);
loadForecast();
