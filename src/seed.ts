import { saveActivity } from './storage';

const DAY = 24 * 60 * 60 * 1000;

const SEED = [
  { name: 'Morning run', durationMinutes: 32, notes: 'Easy pace', daysAgo: 1, at: [6, 10] },
  {
    name: 'Les Mills BodyPump at Cook and Phillip Park Aquatic Centre',
    durationMinutes: 45,
    notes: 'Upper body',
    daysAgo: 2,
    at: [17, 40],
  },
  { name: 'Stretching', durationMinutes: 0, notes: 'Forgot to time it', daysAgo: 3, at: [21, 15] },
  { name: 'Swim', durationMinutes: 40, daysAgo: 3, at: [7, 0] },
  { name: 'Yoga', durationMinutes: 60, notes: 'Hot yoga', daysAgo: 6, at: [18, 30] },
  { name: 'Morning run', durationMinutes: 28, daysAgo: 8, at: [6, 25] },
  { name: 'Spin class', durationMinutes: 45, notes: 'Brutal', daysAgo: 8, at: [18, 0] },
  { name: 'Weights', durationMinutes: 50, daysAgo: 11, at: [17, 15] },
  { name: 'Walk', durationMinutes: 25, notes: 'Lunch break', daysAgo: 13, at: [12, 30] },
  { name: 'Swim', durationMinutes: 35, daysAgo: 15, at: [7, 5] },
  { name: 'Morning run', durationMinutes: 30, daysAgo: 17, at: [6, 0] },
  { name: 'Weights', durationMinutes: 40, notes: 'Legs', daysAgo: 17, at: [18, 10] },
  { name: 'Yoga', durationMinutes: 55, daysAgo: 22, at: [19, 0] },
  { name: 'Spin class', durationMinutes: 45, daysAgo: 24, at: [6, 45] },
  { name: 'Walk', durationMinutes: 20, daysAgo: 24, at: [13, 0] },
  { name: 'Morning run', durationMinutes: 34, notes: 'Felt strong', daysAgo: 29, at: [6, 20] },
  { name: 'Weights', durationMinutes: 45, daysAgo: 31, at: [17, 30] },
  { name: 'Swim', durationMinutes: 30, daysAgo: 31, at: [7, 15] },
  { name: 'Spin class', durationMinutes: 45, daysAgo: 36, at: [18, 15] },
  { name: 'Yoga', durationMinutes: 60, daysAgo: 38, at: [19, 15] },
  { name: 'Walk', durationMinutes: 40, notes: 'Long one by the river', daysAgo: 40, at: [10, 30] },
  { name: 'Morning run', durationMinutes: 26, daysAgo: 43, at: [6, 5] },
  { name: 'Weights', durationMinutes: 55, notes: 'Deadlifts', daysAgo: 43, at: [17, 50] },
  { name: 'Swim', durationMinutes: 45, daysAgo: 47, at: [7, 30] },
  { name: 'Morning run', durationMinutes: 31, daysAgo: 50, at: [6, 15] },
  { name: 'Spin class', durationMinutes: 45, daysAgo: 52, at: [18, 30] },
  { name: 'Yoga', durationMinutes: 50, daysAgo: 52, at: [7, 45] },
  { name: 'Weights', durationMinutes: 42, daysAgo: 57, at: [17, 20] },
  { name: 'Walk', durationMinutes: 30, daysAgo: 59, at: [12, 45] },
  { name: 'Swim', durationMinutes: 38, notes: 'Crowded pool', daysAgo: 59, at: [7, 10] },
  { name: 'Morning run', durationMinutes: 29, daysAgo: 64, at: [6, 30] },
  { name: 'Weights', durationMinutes: 48, daysAgo: 66, at: [18, 0] },
  { name: 'Spin class', durationMinutes: 45, daysAgo: 66, at: [6, 40] },
  { name: 'Yoga', durationMinutes: 45, daysAgo: 71, at: [19, 30] },
  { name: 'Morning run', durationMinutes: 33, daysAgo: 73, at: [6, 20] },
  { name: 'Walk', durationMinutes: 35, daysAgo: 73, at: [13, 15] },
  { name: 'Swim', durationMinutes: 40, daysAgo: 78, at: [7, 20] },
  { name: 'Weights', durationMinutes: 44, notes: 'Back to it after a break', daysAgo: 80, at: [17, 45] },
  { name: 'Morning run', durationMinutes: 27, daysAgo: 80, at: [6, 50] },
];

export async function seedActivities() {
  for (let i = 0; i < SEED.length; i++) {
    const s = SEED[i];
    const loggedAt = new Date(Date.now() - s.daysAgo * DAY);
    loggedAt.setHours(s.at[0], s.at[1], 0, 0);
    await saveActivity({
      id: String(Date.now() - i),
      name: s.name,
      durationMinutes: s.durationMinutes,
      notes: s.notes,
      loggedAt: loggedAt.toISOString(),
    });
  }
}
