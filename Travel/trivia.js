const travels = window.TRAVELOGUES ?? [];

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
const yearRange = document.querySelector('#yearRange');

let questions = [];
let deck = [];
let cursor = 0;
let currentQuestion = null;

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item);
    if (!key) return groups;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
    return groups;
  }, new Map());
}

function shuffle(items) {
  return [...items]
    .map(item => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function subjectFromTitle(title) {
  return title
    .replace(/^\d{4}(?:\s*\/\s*\d{1,2})?(?:\s*\/\s*\d{1,2})?\s*-?\s*/, '')
    .trim() || title;
}

function formatList(values) {
  if (!values.length) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(', ')}, and ${values.at(-1)}`;
}

function routeFor(trip) {
  const stops = trip.stops?.map(stop => stop.name) ?? [];
  return stops.length ? formatList(stops) : trip.place;
}

function tagLabel(tags) {
  return tags.length ? formatList(tags) : 'general travel notes';
}

function sourceFor(trip) {
  return {
    title: trip.title,
    url: trip.url,
    trip
  };
}

function addTripQuestions(bank, trip) {
  bank.push({
    category: 'Place',
    prompt: `Where does the archive place "${trip.title}"?`,
    answer: `${routeFor(trip)}.`,
    ...sourceFor(trip)
  });

  if (Number.isFinite(trip.year)) {
    bank.push({
      category: 'Year',
      prompt: `What year is "${subjectFromTitle(trip.title)}" from?`,
      answer: `${trip.year}.`,
      ...sourceFor(trip)
    });
  }

  if (trip.tags.length) {
    bank.push({
      category: 'Tag',
      prompt: `What archive tag does "${trip.title}" carry?`,
      answer: `${tagLabel(trip.tags)}.`,
      ...sourceFor(trip)
    });
  }
}

function addAggregateQuestions(bank) {
  const years = unique(travels.map(trip => trip.year)).filter(Number.isFinite).sort((a, b) => a - b);
  const byPlace = groupBy(travels, trip => trip.place);
  const byYear = groupBy(travels, trip => trip.year);
  const byTag = groupBy(travels.flatMap(trip => trip.tags.map(tag => ({ tag, trip }))), item => item.tag);
  const topPlace = [...byPlace.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))[0];
  const topYear = [...byYear.entries()].sort((a, b) => b[1].length - a[1].length || b[0] - a[0])[0];
  const earliest = travels.filter(trip => Number.isFinite(trip.year)).sort((a, b) => a.year - b.year || a.title.localeCompare(b.title))[0];
  const latest = travels.filter(trip => Number.isFinite(trip.year)).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))[0];

  bank.push({
    category: 'Archive',
    prompt: 'How many entries are in the travelogue archive?',
    answer: `${travels.length} entries.`
  });

  bank.push({
    category: 'Archive',
    prompt: 'How many mapped places show up across the archive?',
    answer: `${byPlace.size} places.`
  });

  if (years.length) {
    bank.push({
      category: 'Archive',
      prompt: 'What span of years does the archive cover?',
      answer: `${years[0]} through ${years.at(-1)}.`
    });
  }

  if (topPlace) {
    bank.push({
      category: 'Archive',
      prompt: 'Which place shows up the most in the archive?',
      answer: `${topPlace[0]}, with ${topPlace[1].length} entries.`
    });
  }

  if (topYear) {
    bank.push({
      category: 'Archive',
      prompt: 'Which year has the most archive entries?',
      answer: `${topYear[0]}, with ${topYear[1].length} entries.`
    });
  }

  if (earliest) {
    bank.push({
      category: 'Archive',
      prompt: 'Which entry is earliest in the archive?',
      answer: `"${earliest.title}" from ${earliest.year}.`,
      ...sourceFor(earliest)
    });
  }

  if (latest) {
    bank.push({
      category: 'Archive',
      prompt: 'Which entry is newest in the archive?',
      answer: `"${latest.title}" from ${latest.year}.`,
      ...sourceFor(latest)
    });
  }

  byTag.forEach((items, tag) => {
    bank.push({
      category: 'Tag',
      prompt: `How many archive entries are tagged "${tag}"?`,
      answer: `${items.length} entries.`
    });
  });
}

function findTrip(pattern) {
  return travels.find(trip => pattern.test(trip.title));
}

function addJokeQuestions(bank) {
  const jokeSeeds = [
    {
      pattern: /T3: Revenge of the Burrito/i,
      prompt: 'Which title sounds like the third film in a burrito action franchise?',
      answer: trip => `"${trip.title}". The sequel energy is extremely specific.`
    },
    {
      pattern: /Toothpaste/i,
      prompt: 'Which archive entry appears to have packed oral hygiene as the destination?',
      answer: trip => `"${trip.title}". Minty, mysterious, and somehow filed under travel.`
    },
    {
      pattern: /Electriquarium/i,
      prompt: 'Which title sounds like an aquarium that voided the warranty?',
      answer: trip => `"${trip.title}". Water, electricity, and confidence: a bold itinerary.`
    },
    {
      pattern: /100 Songs for Tacos/i,
      prompt: 'Which travelogue sounds like a playlist with excellent priorities?',
      answer: trip => `"${trip.title}". Finally, a soundtrack with dinner built in.`
    },
    {
      pattern: /Something wicked this May comes/i,
      prompt: 'Which title turns spring scheduling into theater?',
      answer: trip => `"${trip.title}". Calendar anxiety, but make it literary.`
    },
    {
      pattern: /Tempel of Steel/i,
      prompt: 'Which entry sounds like a heavy-metal typo became a destination?',
      answer: trip => `"${trip.title}". The archive respects commitment to the bit.`
    },
    {
      pattern: /Oneliners/i,
      prompt: 'Which document namechecks Milton Jones, Gary Delany, Tim Vine, and James Acaster?',
      answer: trip => `"${trip.title}". The comedy shelf is in the travel archive now.`
    },
    {
      pattern: /Selfies of the mind/i,
      prompt: 'Which entry sounds like a camera roll for the inside of your head?',
      answer: trip => `"${trip.title}". The TSA has no policy for that luggage.`
    }
  ];

  jokeSeeds.forEach(seed => {
    const trip = findTrip(seed.pattern);
    if (!trip) return;
    bank.push({
      category: 'Joke',
      prompt: seed.prompt,
      answer: seed.answer(trip),
      ...sourceFor(trip)
    });
  });
}

function buildQuestions() {
  const bank = [];
  travels.forEach(trip => addTripQuestions(bank, trip));
  addAggregateQuestions(bank);
  addJokeQuestions(bank);
  return bank;
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
  const stops = unique(travels.flatMap(trip => trip.stops ?? []).map(stop => stop.name))
    .map(name => travels.flatMap(trip => trip.stops ?? []).find(stop => stop.name === name));
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
  const years = unique(travels.map(trip => trip.year)).filter(Number.isFinite).sort((a, b) => a - b);
  const places = unique(travels.map(trip => trip.place));
  docTotal.textContent = travels.length;
  placeTotal.textContent = places.length;
  yearRange.textContent = years.length ? `${years[0]}-${years.at(-1)}` : '--';
}

function setSource(question) {
  if (!question.url) {
    sourceLink.hidden = true;
    sourceLink.removeAttribute('href');
    return;
  }

  sourceLink.hidden = false;
  sourceLink.href = question.url;
  sourceLink.textContent = question.title ? `Open "${question.title}"` : 'Open source doc';
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
    questionEl.textContent = 'No travel entries were found.';
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
