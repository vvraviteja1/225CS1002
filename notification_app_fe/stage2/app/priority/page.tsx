// app/priority/page.tsx
// Priority inbox — top N notifications by score

"use client";

import { useEffect } from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import Link from "next/link";
import { useAuth } from "../AuthProvider";
import { useNotifications } from "../../hooks/useNotifications";
import PriorityInbox from "../../components/PriorityInbox";
import { Log } from "../../utils/logger";

export default function PriorityPage() {
  const { token } = useAuth();

  const { notifications, loading, error } = useNotifications(token, {
    limit: 50,
  });

  useEffect(() => {
    Log("info", "page", "User opened Priority Inbox page");
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700 }}>
            ⭐ Priority Inbox
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Most important notifications ranked first
          </Typography>
        </Box>
        <Link href="/" passHref>
          <Button variant="outlined" size="small">
            ← All Notifications
          </Button>
        </Link>
      </Box>

      <PriorityInbox
        notifications={notifications}
        loading={loading}
        error={error}
      />
    </Container>
  );
}