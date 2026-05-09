// priorityScore.ts
// Stage 1 — Core priority scoring algorithm
// Priority = Type Weight + Recency Score

export type NotificationType = "Placement" | "Result" | "Event";

export interface Notification {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
}

// Placement is most critical, Result next, Event least
const TYPE_WEIGHT: Record<string, number> = {
  Placement: 30,
  Result: 20,
  Event: 10,
};

// Newer notifications get higher recency score
// Score decays over 48 hours from max of 10
function getRecencyScore(timestamp: string): number {
  const ageMs = Date.now() - new Date(timestamp).getTime();
  const ageInHours = ageMs / (1000 * 60 * 60);
  return Math.max(0, 10 - ageInHours / 4.8);
}

// Final score = type weight + recency bonus
export function getPriorityScore(notification: Notification): number {
  const weight = TYPE_WEIGHT[notification.Type] ?? 10;
  const recency = getRecencyScore(notification.Timestamp);
  return weight + recency;
}

// Sort by score and return top N
export function getTopN(
  notifications: Notification[],
  n: number = 10
): Array<Notification & { score: number }> {
  return [...notifications]
    .map((n) => ({ ...n, score: getPriorityScore(n) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}