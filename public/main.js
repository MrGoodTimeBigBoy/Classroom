const classSelect = document.getElementById('classSelect');
const studentName = document.getElementById('studentName');
const pickBtn = document.getElementById('pickBtn');
const resetRandom = document.getElementById('resetRandom');
const timeDisplay = document.getElementById('timeDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startTimer = document.getElementById('startTimer');
const stopTimer = document.getElementById('stopTimer');
const resetTimer = document.getElementById('resetTimer');
const setTimer = document.getElementById('setTimer');
const minutesInput = document.getElementById('minutesInput');
const secondsInput = document.getElementById('secondsInput');
const countdownList = document.getElementById('countdownList');
const embedFrame = document.getElementById('embedFrame');
const embedBtn = document.getElementById('embedBtn');
const menuBtn = document.getElementById('menuBtn');
const menuPanel = document.getElementById('menuPanel');
const closeMenu = document.getElementById('closeMenu');
const eventName = document.getElementById('eventName');
const eventDate = document.getElementById('eventDate');
const addEvent = document.getElementById('addEvent');
const className = document.getElementById('className');
const studentList = document.getElementById('studentList');
const addClass = document.getElementById('addClass');
const editClass = document.getElementById('editClass');

let classes = {};
let currentClass = null;
let randomPool = [];
let timerInterval = null;
let timerValue = 0;
let timerMode = 'up';
let targetTime = 0;

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

function getTimerMode() {
  return document.querySelector('input[name="timerMode"]:checked').value;
}

function updateTimerDisplay() {
  if (timerMode === 'down') {
    const remaining = Math.max(0, targetTime - timerValue);
    timerDisplay.textContent = formatTime(remaining);
    if (remaining === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerDisplay.style.color = 'red';
      setTimeout(() => timerDisplay.style.color = '', 3000);
    }
  } else {
    timerDisplay.textContent = formatTime(timerValue);
  }
}

setTimer.addEventListener('click', () => {
  const minutes = parseInt(minutesInput.value) || 0;
  const seconds = parseInt(secondsInput.value) || 0;
  targetTime = minutes * 60 + seconds;
  timerMode = getTimerMode();
  
  if (timerMode === 'down') {
    timerValue = 0;
    timerDisplay.textContent = formatTime(targetTime);
  } else {
    timerValue = 0;
    timerDisplay.textContent = '00:00';
  }
  
  clearInterval(timerInterval);
  timerInterval = null;
});

startTimer.addEventListener('click', () => {
  if (timerInterval) return;
  timerMode = getTimerMode();
  
  timerInterval = setInterval(() => {
    timerValue++;
    updateTimerDisplay();
  }, 1000);
});

stopTimer.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerInterval = null;
});

resetTimer.addEventListener('click', () => {
  timerValue = 0;
  timerMode = getTimerMode();
  
  if (timerMode === 'down') {
    timerDisplay.textContent = formatTime(targetTime);
  } else {
    timerDisplay.textContent = '00:00';
  }
  
  clearInterval(timerInterval);
  timerInterval = null;
  timerDisplay.style.color = '';
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
    li.innerHTML = `
      <span>${ev.name}: ${diff} days</span>
      <button class="delete-event" data-event-name="${ev.name}">×</button>
    `;
    countdownList.appendChild(li);
  });
  
  document.querySelectorAll('.delete-event').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const eventName = e.target.dataset.eventName;
      await fetch('/api/events', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ name: eventName })
      });
      loadEvents();
    });
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

menuBtn.addEventListener('click', () => {
  menuPanel.classList.toggle('hidden');
});

closeMenu.addEventListener('click', () => {
  menuPanel.classList.add('hidden');
});

document.getElementById('toggleRandomizer').addEventListener('change', (e) => {
  document.getElementById('randomizer').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('toggleClock').addEventListener('change', (e) => {
  document.getElementById('clock').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('toggleTimer').addEventListener('change', (e) => {
  document.getElementById('timer').style.display = e.target.checked ? 'block' : 'none';
});

document.getElementById('toggleCountdowns').addEventListener('change', (e) => {
  document.getElementById('countdowns').style.display = e.target.checked ? 'block' : 'none';
});

addEvent.addEventListener('click', async () => {
  const name = eventName.value.trim();
  const date = eventDate.value;
  
  if (!name || !date) {
    alert('Please enter both event name and date');
    return;
  }
  
  await fetch('/api/events', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ name, date })
  });
  
  eventName.value = '';
  eventDate.value = '';
  loadEvents();
});

addClass.addEventListener('click', async () => {
  const name = className.value.trim();
  const students = studentList.value.split('\n').map(s => s.trim()).filter(s => s);
  
  if (!name || students.length === 0) {
    alert('Please enter class name and at least one student');
    return;
  }
  
  const classId = name.toLowerCase().replace(/\s+/g, '');
  
  await fetch('/api/classes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ id: classId, name, students })
  });
  
  className.value = '';
  studentList.value = '';
  await loadData();
  menuPanel.classList.add('hidden');
});

editClass.addEventListener('click', () => {
  if (!currentClass || !classes[currentClass]) {
    alert('No class selected');
    return;
  }
  
  const current = classes[currentClass];
  className.value = current.name;
  studentList.value = current.students.join('\n');
});

loadData();
