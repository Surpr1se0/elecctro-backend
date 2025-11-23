import { useState } from "react";

import TaskList from "./components/TaskList";
import NewTask from "./components/NewTask";
import HideCompleted from "./components/HideCompleted";
import TasksHeader from "./components/TasksHeader";

// Sort Modes for the ordering Header
export type SortMode = "created" | "asc" | "desc";

function App() {
  const [sortMode, setSortMode] = useState<SortMode>("created");

  const toggleSortMode = () => {
    setSortMode((prev) => {
      if (prev === "created") return "asc";
      if (prev === "asc") return "desc";
      return "created";
    });
  };

  return (
    <div>
      <NewTask />
      <TasksHeader sortMode={sortMode} onToggleSort={toggleSortMode} />
      <TaskList sortMode={sortMode} />
      <HideCompleted />
    </div>
  );
}

export default App;
