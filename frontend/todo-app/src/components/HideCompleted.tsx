import * as React from "react";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Switch from "@mui/material/Switch";

export default function HideCompleted() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Button pressed");
    setChecked(event.target.checked);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Switch onChange={handleChange} checked={checked} />
      <Typography variant="body2">Hide completed</Typography>
    </Box>
  );
}
