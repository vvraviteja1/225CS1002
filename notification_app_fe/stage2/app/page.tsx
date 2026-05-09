// app/page.tsx
// Main page — all notifications with filter and pagination

"use client";

import { useState, useEffect } from "react";
import {
  Box, Container, Typography,
  Pagination, Alert, CircularProgress, Button,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { useNotifications } from "../hooks/useNotifications";
import { useViewedNotifications } from "../hooks/useViewedNotifications";
import NotificationCard from "../components/NotificationCard";
import FilterBar from "../components/FilterBar";
import { NotificationType } from "../types/notification";
import { Log } from "../utils/logger";

export default function HomePage() {
  const { token } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [type, setType] = useState<NotificationType | "">("");

  const { notifications, loading, error, refetch } = useNotifications(token, {
    page,
    limit,
    notification_type: type || undefined,
  });

  const { isViewed, markAsViewed } = useViewedNotifications();

  useEffect(() => {
    Log("info", "page", "User opened All Notifications page");
  }, []);

  const unreadCount = notifications.filter((n) => !isViewed(n.ID)).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            📬 Campus Notifications
          </Typography>
          {unreadCount > 0 && (
            <Typography variant="caption" color="primary">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </Typography>
          )}
        </Box>
        <Link href="/priority" passHref>
          <Button variant="contained" size="small">
            ⭐ Priority Inbox
          </Button>
        </Link>
      </Box>

      {/* Filter Bar */}
      <FilterBar
        type={type}
        limit={limit}
        onTypeChange={(t) => { setType(t); setPage(1); }}
        onLimitChange={(n) => { setLimit(n); setPage(1); }}
        onRefresh={refetch}
      />

      {/* Notifications List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">Something went wrong: {error}</Alert>
      ) : notifications.length === 0 ? (
        <Alert severity="info">No notifications found.</Alert>
      ) : (
        <>
          {notifications.map((n) => (
            <NotificationCard
              key={n.ID}
              notification={n}
              isViewed={isViewed(n.ID)}
              onView={markAsViewed}
            />
          ))}

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={10}
              page={page}
              onChange={async (_, val) => {
                setPage(val);
                await Log("info", "page", `Navigated to page ${val}`);
              }}
              color="primary"
              size="small"
            />
          </Box>
        </>
      )}
    </Container>
  );
}