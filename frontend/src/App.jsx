import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import EditTaskForm from './EditTaskForm';
import Dashboard from './Dashboard';

function App() {
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [editingTask, setEditingTask] = useState(null); // Task being edited
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (error) { console.error("Error fetching:", error); }
  };

  // Update Task (for Editing and Toggling Complete)
  const updateTask = async (id, updates) => {
    // Optimistic Update
    setTasks(tasks.map(t => t._id === id ? { ...t, ...updates } : t));
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (error) {
      console.error("Error updating:", error);
      fetchTasks(); // Revert on error
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) { console.error("Error deleting:", error); }
  };

  useEffect(() => { fetchTasks(); }, []);

  // --- Handlers ---
  const handleTaskAdded = () => { fetchTasks(); setActiveView('tasks'); };
  const handleTaskUpdated = (id, updates) => { updateTask(id, updates); setEditingTask(null); setActiveView('tasks');};
  const handleEditClick = (task) => { setEditingTask(task); setActiveView('edit'); };
  const handleToggleComplete = (id, status) => updateTask(id, { isCompleted: status });

  // --- Filter Logic ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  // --- Styles ---
  const styles = {
    appContainer: { display: 'flex', height: '100vh', backgroundColor: 'var(--bg-light)' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
    contentArea: { maxWidth: '1000px', margin: '0 auto' },
    filterbar: { display: 'flex', gap: '15px', marginBottom: '25px' },
    searchInput: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none', fontSize: '14px' },
    filterSelect: { padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none', fontSize: '14px', cursor: 'pointer' }
  };

  // --- Render Logic ---
  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} onViewAll={() => setActiveView('tasks')} />;
      case 'add':
        return <TaskForm onTaskAdded={handleTaskAdded} onCancel={() => setActiveView('dashboard')} />;
      case 'edit':
        return <EditTaskForm task={editingTask} onTaskUpdated={handleTaskUpdated} onCancel={() => {setEditingTask(null); setActiveView('tasks');}} />;
      case 'tasks':
        return (
          <div>
            {/* Search & Filter Bar */}
            <div style={styles.filterbar}>
              <input type="text" placeholder="Search tasks..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select style={styles.filterSelect} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            {/* Task List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredTasks.length === 0 ? <p style={{color: '#a3aed0'}}>No tasks found.</p> : 
                filteredTasks.map((task) => (
                  <TaskCard 
                    key={task._id} task={task} 
                    onDelete={handleDelete} onToggleComplete={handleToggleComplete} onEdit={handleEditClick}
                  />
                ))
              }
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main style={styles.mainContent}>
        <div style={styles.contentArea}>
            <Header title={activeView === 'dashboard' ? 'Dashboard' : activeView === 'add' ? 'Create Task' : activeView === 'edit' ? 'Edit Task' : 'My Tasks'} />
            {renderContent()}
        </div>
      </main>
    </div>
  );
}
export default App;