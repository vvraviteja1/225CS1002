// components/FilterBar.tsx
// Filter notifications by type and page size

"use client";

import {
  Box, FormControl, InputLabel,
  Select, MenuItem, TextField, Button,
} from "@mui/material";
import { NotificationType } from "../types/notification";
import { Log } from "../utils/logger";

interface Props {
  type: NotificationType | "";
  limit: number;
  onTypeChange: (t: NotificationType | "") => void;
  onLimitChange: (n: number) => void;
  onRefresh: () => void;
}

export default function FilterBar({
  type, limit, onTypeChange, onLimitChange, onRefresh,
}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "center",
        flexWrap: "wrap",
        mb: 3,
        backgroundColor: "#f5f5f5",
        p: 2,
        borderRadius: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Notification Type</InputLabel>
        <Select
          value={type}
          label="Notification Type"
          onChange={async (e) => {
            const val = e.target.value as NotificationType | "";
            onTypeChange(val);
            await Log("info", "component", `Filter: type changed to ${val || "All"}`);
          }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Per page"
        type="number"
        size="small"
        value={limit}
        onChange={async (e) => {
          const val = Number(e.target.value);
          onLimitChange(val);
          await Log("debug", "component", `Filter: limit changed to ${val}`);
        }}
        slotProps={{
  htmlInput: { min: 5, max: 50 }
}}
        sx={{ width: 110 }}
      />

      <Button variant="outlined" size="small" onClick={onRefresh}>
        Refresh
      </Button>
    </Box>
  );
}