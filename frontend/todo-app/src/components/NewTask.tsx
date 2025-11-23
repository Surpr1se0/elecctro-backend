import {useState} from "react";
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';

export default function NewTask() {
  const [task, setTask] = useState("");
  const [error, setError] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if(task.trim() == ""){
      setError(true); // activate error
      return;
    }

    setTask("");
    setError(false);
  }

  return (
    <Box
      component="form"
      onSubmit={handleAdd}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <TextField
        id="new-task"
        label="New Task"
        placeholder="Insert new task..."
        size="small"
        onChange={(e) => setTask(e.target.value)}
        error={error}
        helperText={error ? "Please insert a task": ""}
      />
      <Button variant="contained" type="submit">
        Create
      </Button>
    </Box>
  );
}