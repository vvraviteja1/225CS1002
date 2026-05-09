// utils/priorityScore.ts
// Priority scoring — placement > result > event + recency bonus

import { Notification } from "../types/notification";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 30,
  Result: 20,
  Event: 10,
};

function getRecencyScore(timestamp: string): number {
  const ageMs = Date.now() - new Date(timestamp).getTime();
  const ageInHours = ageMs / (1000 * 60 * 60);
  return Math.max(0, 10 - ageInHours / 4.8);
}

export function getPriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHT[notification.Type] ?? 10;
  const recency = getRecencyScore(notification.Timestamp);
  return weight + recency;
}

export function getTopN(
  notifications: Notification[],
  n: number = 10
): Array<Notification & { score: number }> {
  return [...notifications]
    .map((n) => ({ ...n, score: getPriorityScore(n) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}