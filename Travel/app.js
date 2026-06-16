const travels = window.TRAVELOGUES ?? [];
const grid = document.querySelector('#travels');
const travelMap = document.querySelector('#travelMap');
const search = document.querySelector('#search');
const tagFilter = document.querySelector('#tagFilter');
const yearFilter = document.querySelector('#yearFilter');

function unique(values) {
  return [...new Set(values)].sort((a, b) => String(a).localeCompare(String(b)));
}

function initFilters() {
  unique(travels.flatMap(t => t.tags)).forEach(tag => {
    tagFilter.add(new Option(tag, tag));
  });

  unique(travels.map(t => t.year)).sort((a, b) => b - a).forEach(year => {
    yearFilter.add(new Option(year, year));
  });
}

function matches(trip) {
  const q = search.value.trim().toLowerCase();
  const selectedTag = tagFilter.value;
  const selectedYear = yearFilter.value;
  const haystack = [trip.title, trip.place, trip.summary, trip.year, ...trip.tags].join(' ').toLowerCase();

  return (!q || haystack.includes(q)) &&
    (selectedTag === 'all' || trip.tags.includes(selectedTag)) &&
    (selectedYear === 'all' || String(trip.year) === selectedYear);
}

function tagHtml(tags) {
  return tags.map(tag => `<span class="tag">${tag}</span>`).join('');
}

function stopList(stops = []) {
  return stops.map(stop => stop.name).join(' -> ');
}

function card(trip) {
  const route = stopList(trip.stops);
  return `
    <article class="card">
      <div class="card-topline"><span>${trip.year}</span><span>${trip.place}</span></div>
      <h2>${trip.title}</h2>
      <p>${trip.summary}</p>
      ${route ? `<p class="route">${route}</p>` : ''}
      <div class="tags">${tagHtml(trip.tags)}</div>
      <a class="button" href="${trip.url}" target="_blank" rel="noopener noreferrer">Read the Google Doc</a>
    </article>`;
}

function render() {
  const filtered = travels.filter(matches).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  grid.innerHTML = filtered.length ? filtered.map(card).join('') : '<p class="empty">No travelogues match that filter.</p>';
  renderMap(filtered);
}

function project(stop) {
  return {
    x: ((stop.lon + 180) / 360) * 100,
    y: ((90 - stop.lat) / 180) * 100
  };
}

function renderMap(filtered) {
  const trips = filtered.filter(trip => trip.stops?.length);
  if (!trips.length) {
    travelMap.innerHTML = '<p class="empty">No mapped stops match that filter.</p>';
    return;
  }

  const places = new Map();
  trips.forEach(trip => {
    trip.stops.forEach(stop => {
      const key = stop.name;
      const place = places.get(key) ?? { stop, trips: [] };
      place.trips.push(trip);
      places.set(key, place);
    });
  });

  const placeList = [...places.values()].sort((a, b) => b.trips.length - a.trips.length || a.stop.name.localeCompare(b.stop.name));
  const markers = placeList.map(place => {
    const point = project(place.stop);
    const count = place.trips.length;
    const radius = Math.min(3.2, 1.3 + count * .12);
    return `
      <g class="map-marker">
        <title>${place.stop.name}: ${count} ${count === 1 ? 'doc' : 'docs'}</title>
        <circle cx="${point.x}" cy="${point.y}" r="${radius.toFixed(2)}"></circle>
        <text x="${Math.min(point.x + radius + 1, 94)}" y="${Math.max(point.y - radius, 5)}">${place.stop.name} (${count})</text>
      </g>`;
  }).join('');

  const legend = placeList.map(place => {
    const titles = place.trips.slice(0, 3).map(trip => trip.title).join(' / ');
    const extra = place.trips.length > 3 ? ` / +${place.trips.length - 3} more` : '';
    return `
    <li>
      <span>${place.trips.length}</span>
      <strong>${place.stop.name}</strong>
      <small>${titles}${extra}</small>
    </li>`;
  }).join('');

  travelMap.innerHTML = `
    <svg class="world-map" viewBox="0 0 100 58" role="img" aria-label="Map of travelogue stops">
      <defs>
        <radialGradient id="oceanGlow" cx="47%" cy="36%" r="78%">
          <stop offset="0%" stop-color="rgba(121,210,192,.18)"></stop>
          <stop offset="100%" stop-color="rgba(121,210,192,.06)"></stop>
        </radialGradient>
      </defs>
      <rect class="map-water" width="100" height="58" rx="3"></rect>
      <path class="map-gridline" d="M8 0 V58 M25 0 V58 M41.7 0 V58 M58.3 0 V58 M75 0 V58 M92 0 V58 M0 9.7 H100 M0 19.3 H100 M0 29 H100 M0 38.7 H100 M0 48.3 H100"></path>
      <path class="map-equator" d="M0 29 H100"></path>
      <path class="landmass" d="M13.4 14.3 16.4 9.8 22.2 7.8 28.3 8.7 33.6 11.1 36.8 15.3 35.4 19.1 39.5 21.8 38.4 26.1 33.6 26.7 30.9 29.4 26.7 28.2 22.1 30.6 18.2 28.1 15.8 23.8 11.4 21.8 10.4 17.6 Z"></path>
      <path class="landmass" d="M27.4 28.8 31.1 31.9 32.7 36.1 35.5 40.3 34.2 45.9 31.4 51.3 28.6 55.6 25.7 51.2 25.2 44.8 22.4 40.3 22.8 34.9 20.1 31.7 22.7 28.6 Z"></path>
      <path class="landmass" d="M41.2 17.8 45.2 14.2 49.6 13.5 53.2 16.1 51.2 19.4 46.5 20.8 42.8 20 Z"></path>
      <path class="landmass" d="M48.7 21.5 54.2 18.8 60.8 18.2 67.3 15.8 76.7 17.9 85.4 19.8 92 24.8 89.6 30.7 80.6 31.4 73.2 30.2 67.9 33.5 59.4 31.5 55.4 28 49.3 27.5 Z"></path>
      <path class="landmass" d="M53.9 29.1 59.6 28.8 64.2 33.8 66.7 40.5 64.4 49.5 59.2 52.6 55.9 47.2 52.8 40 50.8 34.1 Z"></path>
      <path class="landmass" d="M76.8 38.1 83.1 36.3 90.4 39.6 94.8 45.2 90.4 51.5 82.2 51.9 76.8 47.1 73.2 42 Z"></path>
      <path class="landmass island" d="M18.5 8.2 22.6 4.2 27.6 4.9 26 8.2 21.3 9.7 Z"></path>
      <path class="landmass island" d="M45.9 16.1 46.9 14.5 48.4 15.7 47.2 18 Z"></path>
      <path class="landmass island" d="M48 16.7 49.2 14.8 50.6 16.2 49.8 18.2 Z"></path>
      <path class="landmass island" d="M86.8 26.3 88.6 25.3 89.4 27.3 87.8 28.6 Z"></path>
      <path class="landmass island" d="M79.2 31.8 81.2 31.1 82.3 32.8 80.2 33.8 Z"></path>
      ${markers}
    </svg>
    <ol class="map-legend">${legend}</ol>`;
}

initFilters();
render();
[search, tagFilter, yearFilter].forEach(el => el.addEventListener('input', render));
