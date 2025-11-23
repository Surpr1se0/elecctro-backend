import TaskList from './components/TaskList';
import NewTask from './components/NewTask';
import HideCompleted from './components/HideCompleted';

function App() {
  return (
    <div>
      <NewTask />
      <TaskList />
      <HideCompleted />
    </div>
  );
}

export default App;