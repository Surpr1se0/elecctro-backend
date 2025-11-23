import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function HideCompleted() {
  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Button pressed");
    setChecked(event.target.checked);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch onChange={handleChange} checked={checked} />}
        label="Hide Completed"
      />
    </FormGroup>
  );
}

// COMEBACK TO THIS IN DUE TIME
