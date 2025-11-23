import * as React from "react";
import List from "@mui/material/List";
import TextField from "@mui/material/TextField";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { SaveAs } from "@mui/icons-material";

type Task = {
  id: number;
  title: string;
};

export default function TaskList() {
  const [tasks, setTasks] = React.useState<Task[]>([
    { id: 0, title: "Task 1" },
    { id: 1, title: "Task 2" },
    { id: 2, title: "Task 3" },
    { id: 3, title: "Task 4" },
  ]);

  // State for buttons and editing
  const [checked, setChecked] = React.useState([0]);
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editingText, setEditingText] = React.useState<string>("");

  // Checkbox Function Handler
  const handleToggle = (value: number) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  // Editing Start Handler
  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.title);
  };

  // Stop Editing Handler
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };

  // Save Editing Handler
  const saveEditing = () => {
    if (editingId === null) return;

    setTasks((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, title: editingText } : t))
    );

    setEditingId(null);
    setEditingText("");
  };

  // Delete Handler
  const handleDelete = (id: number) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      cancelEditing();
    }
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360 }}>
      {tasks.map((task) => {
        const labelId = `checkbox-list-label-${task.id}`;
        const isEditing = editingId === task.id;

        return (
          <ListItem
            key={task.id}
            secondaryAction={
              isEditing ? (
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={saveEditing}
                  >
                    <SaveAs />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={cancelEditing}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => startEditing(task)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(task.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              )
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(task.id)}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.includes(task.id)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              {isEditing ? (
                <TextField
                  variant="standard"
                  size="small"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  autoFocus
                />
              ) : (
                <ListItemText id={labelId} primary={task.title} />
              )}
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
