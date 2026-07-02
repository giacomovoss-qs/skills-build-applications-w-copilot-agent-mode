import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, Workout } from '../models';

// Seed the octofit_db database with test data.
async function seedDatabase() {
  console.log('Seed the octofit_db database with test data');

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';
  await mongoose.connect(mongoUri);

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    Workout.deleteMany({}),
  ]);

  const users = await User.insertMany([
    {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      role: 'admin',
      fitnessGoal: 'Train for a half marathon',
      city: 'London',
    },
    {
      name: 'Grace Hopper',
      email: 'grace@example.com',
      role: 'coach',
      fitnessGoal: 'Improve strength',
      city: 'New York',
    },
    {
      name: 'Katherine Johnson',
      email: 'katherine@example.com',
      role: 'member',
      fitnessGoal: 'Increase flexibility',
      city: 'Chicago',
    },
  ]);

  const teams = await Team.insertMany([
    {
      name: 'Innovation Lab',
      sport: 'Running',
      members: [users[0]._id, users[2]._id],
      captain: users[0]._id,
    },
    {
      name: 'Performance Squad',
      sport: 'Cycling',
      members: [users[1]._id, users[2]._id],
      captain: users[1]._id,
    },
  ]);

  await Activity.insertMany([
    {
      userId: users[0]._id,
      type: 'run',
      durationMinutes: 34,
      distanceKm: 5.6,
      calories: 320,
      notes: 'Morning tempo run',
    },
    {
      userId: users[1]._id,
      type: 'strength',
      durationMinutes: 50,
      distanceKm: 0,
      calories: 280,
      notes: 'Upper body circuit',
    },
    {
      userId: users[2]._id,
      type: 'cycle',
      durationMinutes: 42,
      distanceKm: 14,
      calories: 410,
      notes: 'Recovery ride',
    },
  ]);

  await LeaderboardEntry.insertMany([
    {
      userId: users[0]._id,
      score: 1280,
      streak: 7,
      rank: 1,
    },
    {
      userId: users[1]._id,
      score: 1160,
      streak: 4,
      rank: 2,
    },
    {
      userId: users[2]._id,
      score: 1020,
      streak: 3,
      rank: 3,
    },
  ]);

  await Workout.insertMany([
    {
      title: 'Morning Mobility',
      difficulty: 'easy',
      durationMinutes: 20,
      focus: 'mobility',
      equipment: ['mat'],
    },
    {
      title: 'Interval Sprint',
      difficulty: 'hard',
      durationMinutes: 30,
      focus: 'cardio',
      equipment: ['running shoes'],
    },
    {
      title: 'Core Strength',
      difficulty: 'medium',
      durationMinutes: 25,
      focus: 'strength',
      equipment: ['bench', 'dumbbells'],
    },
  ]);

  console.log(`Seeded ${users.length} users, ${teams.length} teams, activities, leaderboard entries, and workouts.`);
  await mongoose.disconnect();
}

seedDatabase().catch((error) => {
  console.error('Seeding failed', error);
  process.exit(1);
});
