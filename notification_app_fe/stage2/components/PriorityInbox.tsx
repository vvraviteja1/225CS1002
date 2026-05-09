// components/PriorityInbox.tsx
// Shows top N notifications ranked by priority score

"use client";

import { useState } from "react";
import {
  Box, Typography, TextField,
  FormControl, InputLabel, Select,
  MenuItem, Alert, CircularProgress,
} from "@mui/material";
import { Notification, NotificationType } from "../types/notification";
import { getTopN, getPriorityScore } from "../utils/priorityScore";
import NotificationCard from "./NotificationCard";
import { useViewedNotifications } from "../hooks/useViewedNotifications";
import { Log } from "../utils/logger";

interface Props {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

export default function PriorityInbox({ notifications, loading, error }: Props) {
  const [topN, setTopN] = useState(10);
  const [filterType, setFilterType] = useState<NotificationType | "">("");
  const { isViewed, markAsViewed } = useViewedNotifications();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load: {error}</Alert>;
  }

  const filtered = filterType
    ? notifications.filter((n) => n.Type === filterType)
    : notifications;

  const topNotifications = getTopN(filtered, topN);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
          mb: 3,
          backgroundColor: "#f5f5f5",
          p: 2,
          borderRadius: 2,
        }}
      >
        <TextField
          label="Show top N"
          type="number"
          size="small"
          value={topN}
          onChange={async (e) => {
            const val = Number(e.target.value);
            setTopN(val);
            await Log("info", "component", `Priority: top N changed to ${val}`);
          }}
          slotProps={{
  htmlInput: { min: 1, max: 50 }
}}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="filter-type-label">Filter type</InputLabel>
          <Select
            labelId="filter-type-label"
            label="Filter type"
            value={filterType}
            onChange={async (e) => {
              const val = e.target.value as NotificationType | "";
              setFilterType(val);
              await Log("info", "component", `Priority: filter set to ${val || "All"}`);
            }}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
        Priority: Placement (30pts) → Result (20pts) → Event (10pts) + Recency bonus
      </Typography>

      {topNotifications.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        topNotifications.map((n) => (
          <NotificationCard
            key={n.ID}
            notification={n}
            isViewed={isViewed(n.ID)}
            onView={markAsViewed}
            showScore={true}
            score={getPriorityScore(n)}
          />
        ))
      )}
    </Box>
  );
}