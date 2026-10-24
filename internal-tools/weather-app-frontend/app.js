const citySelect = document.querySelector("#city-select");
const notice = document.querySelector("#notice");
const refreshButton = document.querySelector("#refresh-button");
const numberFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
const API_BASE_URL = (window.WEATHER_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" }).format(new Date(`${value}T12:00:00Z`));
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
    const label = document.createElement("span"); label.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true, timeZone: "UTC" }).format(new Date(`${points[index].time}:00Z`)); chartTimes.append(label);
  });
  document.querySelector("#chart-high").textContent = `HIGH ${numberFormat.format(high)}°`;
  document.querySelector("#chart-low").textContent = `LOW ${numberFormat.format(low)}°`;
  document.querySelector("#today-range").innerHTML = `High ${numberFormat.format(high)}° <i>·</i> Low ${numberFormat.format(low)}°`;
  const currentHour = localHour(timezone);
  document.querySelector("#hourly-list").innerHTML = points.map((point) => {
    const hour = Number(point.time.slice(11, 13));
    const time = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true, timeZone: "UTC" }).format(new Date(`${point.time}:00Z`));
    const currentClass = hour === currentHour ? " is-current" : "";
    const currentLabel = hour === currentHour ? '<span class="current-hour-label">NOW</span>' : "";
    const probability = Number.isFinite(point.precipitation_probability_percent) ? `${numberFormat.format(point.precipitation_probability_percent)}%` : "—";
    const precipitation = Number.isFinite(point.precipitation_mm) ? `${point.precipitation_mm.toFixed(1)} ${precipitationUnit}` : "—";
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
  document.querySelector("#precipitation-high").textContent = peak === null ? "HIGH —%" : `HIGH ${numberFormat.format(peak)}%`;
  document.querySelector("#precipitation-low").textContent = low === null ? "LOW —%" : `LOW ${numberFormat.format(low)}%`;
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
    label.textContent = new Intl.DateTimeFormat(undefined, { hour: "numeric", hour12: true, timeZone: "UTC" }).format(new Date(`${points[index].time}:00Z`));
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
    document.querySelector("#tomorrow-precipitation").textContent = Number.isFinite(forecast.tomorrow.precipitation_sum_mm) ? `${forecast.tomorrow.precipitation_sum_mm.toFixed(1)} ${forecast.precipitation_unit || "mm"}` : "—";
    document.querySelector("#hourly-date").textContent = formatDate(forecast.today.date).toUpperCase();
    document.querySelector("#updated-at").textContent = `Updated ${new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date())}`;
    drawChart(hourly, forecast.timezone, forecast.precipitation_unit || "mm");
  } catch (error) {
    showError(`Could not load the forecast. ${error.message}. Check that the weather API is running, then try again.`);
  } finally { refreshButton.disabled = false; }
}

async function init() {
  try {
    const response = await fetch(`${API_BASE_URL}/cities`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Could not load available cities");
    const { cities } = await response.json();
    citySelect.innerHTML = cities.map((city) => `<option value="${city.id}">${city.name}, ${city.state}</option>`).join("");
    citySelect.addEventListener("change", loadForecast); refreshButton.addEventListener("click", loadForecast); await loadForecast();
  } catch (error) { showError(`${error.message}. Open this page through the running Weather API.`); }
}
init();
