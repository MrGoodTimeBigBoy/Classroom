# Classroom Screen

This project is a prototype classroom management screen inspired by [classroomscreen.com](https://classroomscreen.com). It provides a set of widgets (random student picker, clock, timer, countdowns) and an area to embed presentations.

## Prerequisites
* Node.js 18+ (for running the server)

## Setup
1. Install dependencies (skip if offline):
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and adjust settings if necessary.
3. Build the front‑end files into the `public` folder:
   ```sh
   npm run build
   ```
4. Start the server:
   ```sh
   npm start
   ```
5. Open `http://localhost:3000` in your browser.

## Project Structure
```
├── src      # front‑end source
├── public   # built static files served by express
├── server   # express server
├── data     # JSON files for classes, events, etc.
```

The server exposes simple API endpoints under `/api/*` to read and update configuration stored in JSON files.

Feel free to modify and extend this project for your classroom needs.
