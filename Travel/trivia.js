const travels = window.TRAVELOGUES ?? [];
const contentQuestions = window.TRIVIA_QUESTIONS ?? [];

const categoryEl = document.querySelector('#questionCategory');
const countEl = document.querySelector('#questionCount');
const questionEl = document.querySelector('#questionText');
const answerPanel = document.querySelector('#answerPanel');
const answerEl = document.querySelector('#answerText');
const sourceLink = document.querySelector('#sourceLink');
const revealButton = document.querySelector('#revealAnswer');
const nextButton = document.querySelector('#nextQuestion');
const quizMap = document.querySelector('#quizMap');
const docTotal = document.querySelector('#docTotal');
const placeTotal = document.querySelector('#placeTotal');
const questionTotal = document.querySelector('#questionTotal');

let questions = [];
let deck = [];
let cursor = 0;
let currentQuestion = null;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function shuffle(items) {
  return [...items]
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function findTrip(sourceTitle) {
  if (!sourceTitle) return null;
  return travels.find(trip => trip.title === sourceTitle) ??
    travels.find(trip => trip.title.includes(sourceTitle)) ??
    null;
}

function buildQuestions() {
  return contentQuestions
    .map(question => {
      const trip = findTrip(question.source);
      return {
        category: question.category || 'In-Joke',
        prompt: question.prompt,
        answer: question.answer,
        title: trip?.title || question.source || 'Source doc',
        url: trip?.url || '',
        trip
      };
    })
    .filter(question => question.prompt && question.answer);
}

function project(stop) {
  return {
    x: ((stop.lon + 180) / 360) * 100,
    y: ((90 - stop.lat) / 180) * 56
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderMap(activeTrip) {
  const allStops = travels.flatMap(trip => trip.stops ?? []);
  const stops = unique(allStops.map(stop => stop.name))
    .map(name => allStops.find(stop => stop.name === name));
  const activeStops = new Set((activeTrip?.stops ?? []).map(stop => stop.name));
  const markers = stops.map(stop => {
    const point = project(stop);
    const active = activeStops.has(stop.name);
    return `
      <g class="${active ? 'active-stop' : 'quiet-stop'}">
        <circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="${active ? '2.45' : '1.15'}"></circle>
        ${active ? `<text x="${Math.min(point.x + 3, 87).toFixed(2)}" y="${Math.max(point.y - 2, 5).toFixed(2)}">${escapeHtml(stop.name)}</text>` : ''}
      </g>`;
  }).join('');

  quizMap.innerHTML = `
    <svg viewBox="0 0 100 56" role="img" aria-label="">
      <rect class="map-water" width="100" height="56" rx="3"></rect>
      <path class="map-gridline" d="M10 0 V56 M30 0 V56 M50 0 V56 M70 0 V56 M90 0 V56 M0 9.3 H100 M0 18.6 H100 M0 28 H100 M0 37.3 H100 M0 46.6 H100"></path>
      <path class="map-equator" d="M0 28 H100"></path>
      <path class="landmass" d="M13.4 13.8 16.4 9.4 22.2 7.5 28.3 8.4 33.6 10.7 36.8 14.8 35.4 18.4 39.5 21 38.4 25.2 33.6 25.8 30.9 28.4 26.7 27.3 22.1 29.5 18.2 27.1 15.8 23 11.4 21 10.4 17 Z"></path>
      <path class="landmass" d="M27.4 27.8 31.1 30.8 32.7 34.8 35.5 38.9 34.2 44.3 31.4 49.5 28.6 53.7 25.7 49.4 25.2 43.3 22.4 38.9 22.8 33.7 20.1 30.6 22.7 27.6 Z"></path>
      <path class="landmass" d="M41.2 17.2 45.2 13.7 49.6 13 53.2 15.5 51.2 18.7 46.5 20.1 42.8 19.3 Z"></path>
      <path class="landmass" d="M48.7 20.8 54.2 18.1 60.8 17.6 67.3 15.2 76.7 17.3 85.4 19.1 92 23.9 89.6 29.6 80.6 30.3 73.2 29.2 67.9 32.3 59.4 30.4 55.4 27 49.3 26.5 Z"></path>
      <path class="landmass" d="M53.9 28.1 59.6 27.8 64.2 32.6 66.7 39.1 64.4 47.8 59.2 50.8 55.9 45.6 52.8 38.6 50.8 32.9 Z"></path>
      <path class="landmass" d="M76.8 36.8 83.1 35 90.4 38.2 94.8 43.6 90.4 49.7 82.2 50.1 76.8 45.5 73.2 40.5 Z"></path>
      ${markers}
    </svg>`;
}

function updateStats() {
  const places = unique(travels.map(trip => trip.place));
  docTotal.textContent = travels.length;
  placeTotal.textContent = places.length;
  questionTotal.textContent = questions.length;
}

function setSource(question) {
  if (!question.url) {
    sourceLink.hidden = true;
    sourceLink.removeAttribute('href');
    return;
  }

  sourceLink.hidden = false;
  sourceLink.href = question.url;
  sourceLink.textContent = 'Open source doc';
}

function showQuestion(question) {
  currentQuestion = question;
  categoryEl.textContent = question.category;
  countEl.textContent = `${cursor} / ${questions.length}`;
  questionEl.textContent = question.prompt;
  answerEl.textContent = question.answer;
  answerPanel.hidden = true;
  revealButton.disabled = false;
  revealButton.textContent = 'Reveal answer';
  setSource(question);
  renderMap(question.trip);
}

function nextQuestion() {
  if (!questions.length) {
    categoryEl.textContent = 'Archive';
    countEl.textContent = '0 / 0';
    questionEl.textContent = 'No content questions were found.';
    answerPanel.hidden = true;
    revealButton.disabled = true;
    nextButton.disabled = true;
    renderMap();
    return;
  }

  if (!deck.length || cursor >= deck.length) {
    deck = shuffle(questions);
    cursor = 0;
  }

  cursor += 1;
  showQuestion(deck[cursor - 1]);
}

function revealAnswer() {
  if (!currentQuestion) return;
  answerPanel.hidden = false;
  revealButton.disabled = true;
  revealButton.textContent = 'Answer revealed';
}

questions = buildQuestions();
deck = shuffle(questions);
updateStats();
nextQuestion();

revealButton.addEventListener('click', revealAnswer);
nextButton.addEventListener('click', nextQuestion);
