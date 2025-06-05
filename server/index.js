import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

const DATA_DIR = path.join(__dirname, '..', 'data');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'));
}

function writeJson(file, data) {
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

app.get('/api/classes', (req, res) => {
  res.json(readJson('classes.json'));
});

app.post('/api/classes', (req, res) => {
  const classes = readJson('classes.json');
  const { id, name, students } = req.body;
  classes[id] = { name, students };
  writeJson('classes.json', classes);
  res.json({ status: 'ok' });
});

app.get('/api/schedule', (req, res) => {
  res.json(readJson('schedule.json'));
});

app.post('/api/schedule', (req, res) => {
  writeJson('schedule.json', req.body);
  res.json({ status: 'ok' });
});

app.get('/api/events', (req, res) => {
  res.json(readJson('events.json'));
});

app.post('/api/events', (req, res) => {
  const events = readJson('events.json');
  const { name, date } = req.body;
  events.push({ name, date });
  writeJson('events.json', events);
  res.json({ status: 'ok' });
});

app.delete('/api/events', (req, res) => {
  const events = readJson('events.json');
  const { name } = req.body;
  const filtered = events.filter(event => event.name !== name);
  writeJson('events.json', filtered);
  res.json({ status: 'ok' });
});

app.get('/api/embed', (req, res) => {
  res.json(readJson('embed.json'));
});

app.post('/api/embed', (req, res) => {
  writeJson('embed.json', req.body);
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
