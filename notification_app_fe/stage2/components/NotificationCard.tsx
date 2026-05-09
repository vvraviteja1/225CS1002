// components/NotificationCard.tsx
// Single notification card with type badge and new/viewed indicator

"use client";

import {
  Card, CardContent, Typography,
  Chip, Box, Tooltip,
} from "@mui/material";
import { Notification } from "../types/notification";
import { Log } from "../utils/logger";

interface Props {
  notification: Notification;
  isViewed: boolean;
  onView: (id: string) => void;
  showScore?: boolean;
  score?: number;
}

const TYPE_COLOR: Record<string, "error" | "warning" | "info"> = {
  Placement: "error",
  Result: "warning",
  Event: "info",
};

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationCard({
  notification, isViewed, onView, showScore, score,
}: Props) {
  const handleClick = async () => {
    if (!isViewed) {
      onView(notification.ID);
      await Log("info", "component",
        `Notification clicked: ${notification.ID} [${notification.Type}]`
      );
    }
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        mb: 1.5,
        cursor: isViewed ? "default" : "pointer",
        borderLeft: isViewed ? "4px solid #e0e0e0" : "4px solid #1976d2",
        backgroundColor: isViewed ? "#fafafa" : "#fff",
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: isViewed ? 1 : 4 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Chip
              label={notification.Type}
              color={TYPE_COLOR[notification.Type] ?? "default"}
              size="small"
            />
            {!isViewed && (
              <Chip label="New" color="primary" size="small" variant="outlined" />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {showScore && score !== undefined && (
              <Tooltip title="Priority score">
                <Chip
                  label={`Score: ${score.toFixed(1)}`}
                  size="small"
                  sx={{ backgroundColor: "#f0f4ff", fontSize: "0.7rem" }}
                />
              </Tooltip>
            )}
            <Typography variant="caption" color="text.secondary">
              {formatTime(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: isViewed ? 400 : 600 }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
}