// hooks/useViewedNotifications.ts
// Tracks which notifications user has already seen
// Persists across refreshes using localStorage

import { useEffect, useState } from "react";
import { Log } from "../utils/logger";

const STORAGE_KEY = "viewed_notifications";

export function useViewedNotifications() {
  const [viewed, setViewed] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setViewed(new Set(JSON.parse(stored)));
    } catch {
      console.warn("Could not load viewed notifications");
    }
  }, []);

  const markAsViewed = async (id: string) => {
    setViewed((prev) => {
      const updated = new Set(prev);
      updated.add(id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...updated]));
      return updated;
    });
    await Log("info", "state", `Notification viewed: ${id}`);
  };

  const isViewed = (id: string) => viewed.has(id);

  return { isViewed, markAsViewed };
}