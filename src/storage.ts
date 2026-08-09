import AsyncStorage from '@react-native-async-storage/async-storage';
import { Activity } from './types';

export async function loadActivities(): Promise<Activity[]> {
  const raw = await AsyncStorage.getItem('activities');
  if (!raw) {
    return [];
  }
  return JSON.parse(raw);
}

export async function saveActivity(activity: Activity) {
  const raw = await AsyncStorage.getItem('activities');
  const all = raw ? JSON.parse(raw) : [];
  all.push(activity);
  await AsyncStorage.setItem('activities', JSON.stringify(all));
}

export async function deleteActivity(id: string) {
  const raw = await AsyncStorage.getItem('activities');
  const all = raw ? JSON.parse(raw) : [];
  const remaining = all.filter((a: Activity) => a.id !== id);
  await AsyncStorage.setItem('activities', JSON.stringify(remaining));
}
