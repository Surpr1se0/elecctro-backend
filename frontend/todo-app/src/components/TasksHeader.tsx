import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { SortMode } from "../App";

type Props = {
  sortMode: SortMode;
  onToggleSort: () => void;
};

export default function TasksHeader({ sortMode, onToggleSort }: Props) {
  let label = "Tasks (by creation date)";
  if (sortMode === "asc") label = "Tasks (A-Z)";
  if (sortMode === "desc") label = "Tasks (Z-A)";

  return (
    <Box
      onClick={onToggleSort}
      sx={{
        fontWeight: "bold",
        cursor: "pointer",
        marginBottom: 1,
        userSelect: "none",
      }}
    >
      <Typography variant="subtitle1">{label}</Typography>
    </Box>
  );
}
