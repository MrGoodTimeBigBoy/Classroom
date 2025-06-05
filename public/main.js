const classSelect = document.getElementById('classSelect');
const studentName = document.getElementById('studentName');
const pickBtn = document.getElementById('pickBtn');
const resetRandom = document.getElementById('resetRandom');
const timeDisplay = document.getElementById('timeDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startTimer = document.getElementById('startTimer');
const stopTimer = document.getElementById('stopTimer');
const resetTimer = document.getElementById('resetTimer');
const countdownList = document.getElementById('countdownList');
const embedFrame = document.getElementById('embedFrame');
const embedBtn = document.getElementById('embedBtn');

let classes = {};
let currentClass = null;
let randomPool = [];
let timerInterval = null;
let timerValue = 0;

async function loadData() {
  classes = await fetch('/api/classes').then(r => r.json());
  const embed = await fetch('/api/embed').then(r => r.json());
  embedFrame.src = embed.defaultUrl;
  populateClasses();
  loadEvents();
}

function populateClasses() {
  classSelect.innerHTML = '';
  Object.entries(classes).forEach(([id, c]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = c.name;
    classSelect.appendChild(opt);
  });
  currentClass = classSelect.value;
  resetRandomPool();
}

function resetRandomPool() {
  randomPool = [...classes[currentClass].students];
}

pickBtn.addEventListener('click', () => {
  if (randomPool.length === 0) {
    studentName.textContent = 'All picked';
    return;
  }
  const idx = Math.floor(Math.random() * randomPool.length);
  const name = randomPool.splice(idx, 1)[0];
  studentName.textContent = name;
});

resetRandom.addEventListener('click', () => {
  resetRandomPool();
  studentName.textContent = '--';
});

classSelect.addEventListener('change', () => {
  currentClass = classSelect.value;
  resetRandomPool();
});

function updateClock() {
  const now = new Date();
  timeDisplay.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

startTimer.addEventListener('click', () => {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    timerValue++;
    timerDisplay.textContent = formatTime(timerValue);
  }, 1000);
});

stopTimer.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetTimer.addEventListener('click', () => {
  timerValue = 0;
  timerDisplay.textContent = '00:00';
  clearInterval(timerInterval);
  timerInterval = null;
});

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

async function loadEvents() {
  const events = await fetch('/api/events').then(r => r.json());
  countdownList.innerHTML = '';
  const today = new Date().setHours(0,0,0,0);
  events.forEach(ev => {
    const date = new Date(ev.date).setHours(0,0,0,0);
    const diff = Math.floor((date - today) / (1000*60*60*24));
    const li = document.createElement('li');
    li.textContent = `${ev.name}: ${diff} days`;
    countdownList.appendChild(li);
  });
}

embedBtn.addEventListener('click', async () => {
  const url = prompt('Enter embed URL');
  if (!url) return;
  embedFrame.src = url;
  await fetch('/api/embed', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ defaultUrl: url })
  });
});

loadData();
