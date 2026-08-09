import { useEffect, useState } from 'react';
import { Activity } from './types';
import { loadActivities, saveActivity, deleteActivity } from './storage';
import { seedActivities } from './seed';

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      let stored = await loadActivities();
      if (stored.length === 0) {
        await seedActivities();
        stored = await loadActivities();
      }
      setActivities(stored);
      setLoading(false);
    }
    load();
  }, []);

  async function addActivity(name: string, duration: string, notes: string) {
    await saveActivity({
      id: String(Date.now()),
      name: name,
      durationMinutes: parseInt(duration),
      notes: notes,
      loggedAt: new Date().toISOString(),
    });
    setActivities(await loadActivities());
  }

  async function removeActivity(id: string) {
    await deleteActivity(id);
    setActivities(await loadActivities());
  }

  return { activities, loading, addActivity, removeActivity };
}
