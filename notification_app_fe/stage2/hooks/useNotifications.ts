// hooks/useNotifications.ts
// Fetches notifications and manages loading/error state

import { useEffect, useState } from "react";
import { Notification, FetchParams } from "../types/notification";
import { fetchNotifications } from "../utils/api";
import { Log } from "../utils/logger";

interface UseNotificationsResult {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useNotifications(
  token: string,
  params: FetchParams = {}
): UseNotificationsResult {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      await Log("debug", "hook", "useNotifications: fetching...");

      try {
        const data = await fetchNotifications(token, params);
        if (!cancelled) {
          setNotifications(data.notifications ?? []);
          await Log("info", "hook", `Loaded ${data.notifications?.length} notifications`);
        }
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setError(msg);
          await Log("error", "hook", `useNotifications failed: ${msg}`);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [token, trigger, params.page, params.limit, params.notification_type]);

  const refetch = () => setTrigger((t) => t + 1);
  return { notifications, loading, error, refetch };
}