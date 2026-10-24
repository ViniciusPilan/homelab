const citySelect = document.querySelector("#city-select");
const notice = document.querySelector("#notice");
const refreshButton = document.querySelector("#refresh-button");
const languageToggle = document.querySelector("#language-toggle");
const API_BASE_URL = (window.WEATHER_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const translations = {
  "en-US": {
    topbarNote: "LOCAL WEATHER, MADE SIMPLE", brandAria: "Fieldnote weather home", chooseCity: "Choose a city", dailyOutlook: "YOUR DAILY OUTLOOK", headline: "A little more in tune<br />with the <em>weather.</em>", forecastFor: "FORECAST FOR", forecastAria: "Temperature forecast", temperatureChart: "Today's hourly temperature chart", precipitationChart: "Today's hourly precipitation probability chart", today: "TODAY", loadingForecast: "Loading forecast…", currentForecast: "CURRENT FORECAST", precipitationAria: "Precipitation probability forecast", chanceRain: "CHANCE OF RAIN", hourlyPrecipitation: "Hourly precipitation probability", hourByHour: "HOUR BY HOUR", hour: "HOUR", rain: "RAIN", temp: "TEMP", tomorrow: "TOMORROW", meanTemperature: "MEAN TEMPERATURE", rainChance: "Rain chance", expected: "Expected", tomorrowCopy: "A quick look at what<br />the day has in store.", forecastBy: "Forecast data by", hourlyAria: "Hourly temperature and precipitation forecast for today", refreshForecast: "Refresh forecast", footerCopy: "Take the day as it comes.", high: "High", low: "Low", now: "NOW", updated: "Updated", connecting: "Connecting to your weather API…", error: "Could not load the forecast. {message}. Check that the weather API is running, then try again.", initError: "{message}. Open this page through the running Weather API."
  },
  "pt-BR": {
    topbarNote: "CLIMA LOCAL, SEM COMPLICAÇÃO", brandAria: "Página inicial do clima Fieldnote", chooseCity: "Escolha uma cidade", dailyOutlook: "A PREVISÃO DO SEU DIA", headline: "Mais conexão<br />com o <em>clima.</em>", forecastFor: "PREVISÃO PARA", forecastAria: "Previsão de temperatura", temperatureChart: "Gráfico horário de temperatura de hoje", precipitationChart: "Gráfico horário de probabilidade de chuva de hoje", today: "HOJE", loadingForecast: "Carregando previsão…", currentForecast: "PREVISÃO ATUAL", precipitationAria: "Previsão de probabilidade de chuva", chanceRain: "CHANCE DE CHUVA", hourlyPrecipitation: "Probabilidade de chuva por hora", hourByHour: "HORA A HORA", hour: "HORA", rain: "CHUVA", temp: "TEMP.", tomorrow: "AMANHÃ", meanTemperature: "TEMPERATURA MÉDIA", rainChance: "Chance de chuva", expected: "Previsto", tomorrowCopy: "Veja rapidamente o que<br />o dia reserva para você.", forecastBy: "Previsão fornecida por", hourlyAria: "Previsão de temperatura e chuva por hora para hoje", refreshForecast: "Atualizar previsão", footerCopy: "Vá no ritmo do seu dia.", high: "Máx.", low: "Mín.", now: "AGORA", updated: "Atualizado", connecting: "Conectando à API de previsão do tempo…", error: "Não foi possível carregar a previsão. {message}. Verifique se a API está ativa e tente novamente.", initError: "{message}. Abra esta página com a API de previsão do tempo em execução."
  }
};
const savedLocale = localStorage.getItem("weather-locale");
let locale = savedLocale === "en-US" || savedLocale === "pt-BR" ? savedLocale : "pt-BR";
let numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
const t = (key) => translations[locale][key];

function setLanguage(nextLocale) {
  locale = nextLocale;
  localStorage.setItem("weather-locale", locale);
  document.documentElement.lang = locale;
  numberFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  document.querySelectorAll("[data-i18n]").forEach((element) => { element.innerHTML = t(element.dataset.i18n); });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => { element.setAttribute("aria-label", t(element.dataset.i18nAria)); });
  document.querySelectorAll("[data-i18n-title]").forEach((element) => { element.title = t(element.dataset.i18nTitle); });
  document.querySelector("#today-range").innerHTML = `${t("high")} —° <i>·</i> ${t("low")} —°`;
  document.querySelector("#chart-high").textContent = `${t("high").toUpperCase()} —°`;
  document.querySelector("#chart-low").textContent = `${t("low").toUpperCase()} —°`;
  document.querySelector("#precipitation-high").textContent = `${t("high").toUpperCase()} —%`;
  document.querySelector("#precipitation-low").textContent = `${t("low").toUpperCase()} —%`;
  document.querySelector("#hourly-date").textContent = t("today");
  document.querySelector("#updated-at").textContent = t("connecting");
  languageToggle.textContent = locale === "en-US" ? "PT-BR" : "EN-US";
  languageToggle.setAttribute("aria-label", locale === "en-US" ? "Mudar idioma para português do Brasil" : "Change language to English (United States)");
  languageToggle.setAttribute("aria-pressed", String(locale === "pt-BR"));
  if (document.querySelector("#today-date").textContent !== "—") loadForecast();
}

function formatDate(value) {
  return new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
}

function formatHour(value) {
  return new Intl.DateTimeFormat(locale, { hour: "numeric", timeZone: "UTC" }).format(new Date(`${value}:00Z`));
}

function showError(message) { notice.textContent = message; notice.hidden = false; }

function localHour(timezone) {
  return Number(new Intl.DateTimeFormat("en", { hour: "2-digit", hourCycle: "h23", timeZone: timezone }).format(new Date()));
}

function drawChart(points, timezone, precipitationUnit) {
  const svg = document.querySelector("#temperature-chart");
  const chartTimes = document.querySelector("#chart-times");
  svg.replaceChildren(); chartTimes.replaceChildren();
  if (!points.length) return;
  const values = points.map((point) => point.temperature_c).filter(Number.isFinite);
  const low = Math.min(...values); const high = Math.max(...values); const spread = Math.max(high - low, 4);
  const min = low - spread * 0.25; const max = high + spread * 0.25;
  const coords = points.map((point, index) => ({ x: 12 + (index / Math.max(points.length - 1, 1)) * 696, y: 166 - ((point.temperature_c - min) / (max - min)) * 136 }));
  const line = coords.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
  const area = `${line} L${coords.at(-1).x},190 L${coords[0].x},190 Z`;
  const ns = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(ns, "defs"); const gradient = document.createElementNS(ns, "linearGradient");
  gradient.id = "chart-fill"; gradient.setAttribute("x1", "0"); gradient.setAttribute("x2", "0"); gradient.setAttribute("y1", "0"); gradient.setAttribute("y2", "1");
  [["0%", "0.28"], ["100%", "0"]].forEach(([offset, opacity]) => { const stop = document.createElementNS(ns, "stop"); stop.setAttribute("offset", offset); stop.setAttribute("stop-color", "#efaa59"); stop.setAttribute("stop-opacity", opacity); gradient.append(stop); });
  defs.append(gradient); svg.append(defs);
  const areaPath = document.createElementNS(ns, "path"); areaPath.setAttribute("d", area); areaPath.setAttribute("fill", "url(#chart-fill)"); svg.append(areaPath);
  const linePath = document.createElementNS(ns, "path"); linePath.setAttribute("d", line); linePath.setAttribute("class", "chart-line"); svg.append(linePath);
  [0, 6, 12, 18, 23].filter((index) => index < points.length).forEach((index) => {
    const point = coords[index]; const dot = document.createElementNS(ns, "circle");
    dot.setAttribute("cx", point.x); dot.setAttribute("cy", point.y); dot.setAttribute("r", "4"); dot.setAttribute("class", "chart-dot"); svg.append(dot);
    const label = document.createElement("span"); label.textContent = formatHour(points[index].time); chartTimes.append(label);
  });
  document.querySelector("#chart-high").textContent = `${t("high").toUpperCase()} ${numberFormat.format(high)}°`;
  document.querySelector("#chart-low").textContent = `${t("low").toUpperCase()} ${numberFormat.format(low)}°`;
  document.querySelector("#today-range").innerHTML = `${t("high")} ${numberFormat.format(high)}° <i>·</i> ${t("low")} ${numberFormat.format(low)}°`;
  const currentHour = localHour(timezone);
  document.querySelector("#hourly-list").innerHTML = points.map((point) => {
    const hour = Number(point.time.slice(11, 13));
    const time = formatHour(point.time);
    const currentClass = hour === currentHour ? " is-current" : "";
    const currentLabel = hour === currentHour ? `<span class="current-hour-label">${t("now")}</span>` : "";
    const probability = Number.isFinite(point.precipitation_probability_percent) ? `${numberFormat.format(point.precipitation_probability_percent)}%` : "—";
    const precipitation = Number.isFinite(point.precipitation_mm) ? `${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(point.precipitation_mm)} ${precipitationUnit}` : "—";
    return `<div class="hourly-forecast-row${currentClass}"><span class="hourly-forecast-time">${time}${currentLabel}</span><span class="hourly-rain"><strong>${probability}</strong><small>${precipitation}</small></span><strong class="hourly-temperature">${numberFormat.format(point.temperature_c)}°</strong></div>`;
  }).join("");
  drawPrecipitationChart(points);
}

function drawPrecipitationChart(points) {
  const svg = document.querySelector("#precipitation-chart");
  const times = document.querySelector("#precipitation-times");
  svg.replaceChildren();
  times.replaceChildren();

  const probabilities = points.map((point) => point.precipitation_probability_percent);
  const validValues = probabilities.filter(Number.isFinite);
  const peak = validValues.length ? Math.max(...validValues) : null;
  const low = validValues.length ? Math.min(...validValues) : null;
  document.querySelector("#precipitation-high").textContent = peak === null ? `${t("high").toUpperCase()} —%` : `${t("high").toUpperCase()} ${numberFormat.format(peak)}%`;
  document.querySelector("#precipitation-low").textContent = low === null ? `${t("low").toUpperCase()} —%` : `${t("low").toUpperCase()} ${numberFormat.format(low)}%`;
  if (!points.length || !validValues.length) return;

  const ns = "http://www.w3.org/2000/svg";
  const spread = Math.max(peak - low, 4);
  const min = Math.max(0, low - spread * 0.25);
  const max = Math.min(100, peak + spread * 0.25);
  const xFor = (index) => 12 + (index / Math.max(points.length - 1, 1)) * 696;
  const yFor = (value) => 166 - ((value - min) / Math.max(max - min, 1)) * 136;

  const coords = probabilities.map((value, index) => Number.isFinite(value) ? { x: xFor(index), y: yFor(value) } : null);
  const segments = [];
  let activeSegment = [];
  coords.forEach((point) => {
    if (point) activeSegment.push(point);
    else if (activeSegment.length) { segments.push(activeSegment); activeSegment = []; }
  });
  if (activeSegment.length) segments.push(activeSegment);

  const defs = document.createElementNS(ns, "defs");
  const gradient = document.createElementNS(ns, "linearGradient");
  gradient.id = "precipitation-fill";
  gradient.setAttribute("x1", "0"); gradient.setAttribute("x2", "0");
  gradient.setAttribute("y1", "0"); gradient.setAttribute("y2", "1");
  [["0%", "0.28"], ["100%", "0"]].forEach(([offset, opacity]) => {
    const stop = document.createElementNS(ns, "stop");
    stop.setAttribute("offset", offset); stop.setAttribute("stop-color", "#4e9ec2"); stop.setAttribute("stop-opacity", opacity);
    gradient.append(stop);
  });
  defs.append(gradient); svg.append(defs);

  segments.forEach((segment) => {
    const path = segment.map((point, index) => `${index ? "L" : "M"}${point.x},${point.y}`).join(" ");
    if (segment.length > 1) {
      const area = document.createElementNS(ns, "path");
      area.setAttribute("d", `${path} L${segment.at(-1).x},190 L${segment[0].x},190 Z`);
      area.setAttribute("fill", "url(#precipitation-fill)"); svg.append(area);
    }
    const line = document.createElementNS(ns, "path");
    line.setAttribute("d", path); line.setAttribute("class", "precipitation-line"); svg.append(line);
  });

  [0, 6, 12, 18, 23].filter((index) => index < points.length).forEach((index) => {
    const point = coords[index];
    if (point) {
      const dot = document.createElementNS(ns, "circle");
      dot.setAttribute("cx", point.x); dot.setAttribute("cy", point.y); dot.setAttribute("r", "3.5");
      dot.setAttribute("class", "precipitation-dot"); svg.append(dot);
    }
    const label = document.createElement("span");
    label.textContent = formatHour(points[index].time);
    times.append(label);
  });
}

async function loadForecast() {
  notice.hidden = true; refreshButton.disabled = true;
  try {
    const response = await fetch(`${API_BASE_URL}/weather?city=${encodeURIComponent(citySelect.value)}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
    const forecast = await response.json(); const hourly = forecast.today.hourly;
    const values = hourly.map((point) => point.temperature_c).filter(Number.isFinite);
    const current = hourly.find((point) => Number(point.time.slice(11, 13)) >= localHour(forecast.timezone)) || hourly.at(-1);
    document.querySelector("#city-name").textContent = forecast.city || "Your location";
    document.querySelector("#today-date").textContent = formatDate(forecast.today.date);
    document.querySelector("#tomorrow-date").textContent = formatDate(forecast.tomorrow.date);
    document.querySelector("#current-temp").textContent = `${numberFormat.format(current?.temperature_c ?? values[0])}°`;
    document.querySelector("#tomorrow-temp").innerHTML = `${numberFormat.format(forecast.tomorrow.average_temperature)}<small>°</small>`;
    document.querySelector("#tomorrow-rain-probability").textContent = Number.isFinite(forecast.tomorrow.maximum_precipitation_probability_percent) ? `${numberFormat.format(forecast.tomorrow.maximum_precipitation_probability_percent)}%` : "—";
    document.querySelector("#tomorrow-precipitation").textContent = Number.isFinite(forecast.tomorrow.precipitation_sum_mm) ? `${new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(forecast.tomorrow.precipitation_sum_mm)} ${forecast.precipitation_unit || "mm"}` : "—";
    document.querySelector("#hourly-date").textContent = formatDate(forecast.today.date).toUpperCase();
    document.querySelector("#updated-at").textContent = `${t("updated")} ${new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(new Date())}`;
    drawChart(hourly, forecast.timezone, forecast.precipitation_unit || "mm");
  } catch (error) {
    showError(t("error").replace("{message}", error.message));
  } finally { refreshButton.disabled = false; }
}

async function init() {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Could not load available cities");
    const { cities } = await response.json();
    citySelect.innerHTML = cities.map((city) => `<option value="${city.id}">${city.name}, ${city.state}</option>`).join("");
    citySelect.addEventListener("change", loadForecast); refreshButton.addEventListener("click", loadForecast); await loadForecast();
  } catch (error) { showError(t("initError").replace("{message}", error.message)); }
}
languageToggle.addEventListener("click", () => setLanguage(locale === "en-US" ? "pt-BR" : "en-US"));
setLanguage(locale);
init();
