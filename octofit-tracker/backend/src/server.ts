import express from 'express';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from './models';
import { connectToMongo, mongoUri } from './database';

const app = express();
app.use(express.json());

const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : `http://localhost:${port}`;

// `mongoUri` and `connectToMongo` are provided by `src/database.ts`

async function registerCollectionRoutes() {
  const routes = [
    { path: ['/api/users', '/api/users/'], model: User },
    { path: ['/api/teams', '/api/teams/'], model: Team },
    { path: ['/api/activities', '/api/activities/'], model: Activity },
    { path: ['/api/leaderboard', '/api/leaderboard/'], model: LeaderboardEntry },
    { path: ['/api/workouts', '/api/workouts/'], model: Workout },
  ];

  routes.forEach(({ path, model }) => {
    app.get(path, async (_req, res) => {
      try {
        const items = await model.find({});
        res.json(items);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data', details: error });
      }
    });

    app.post(path, async (req, res) => {
      try {
        const newItem = await model.create(req.body);
        res.status(201).json(newItem);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create item', details: error });
      }
    });
  });
}

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Octofit Tracker backend is running',
    apiBaseUrl,
  });
});

app.get('/api/config', (_req, res) => {
  res.json({ apiBaseUrl, port, mongoUri });
});

async function startServer() {
  await connectToMongo();
  await registerCollectionRoutes();

  app.listen(port, () => {
    console.log(`Octofit Tracker API listening on port ${port}`);
    console.log(`API base URL: ${apiBaseUrl}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
