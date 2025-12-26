// frontend/src/App.jsx
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import EditTaskForm from './EditTaskForm';
import Dashboard from './Dashboard';
import AuthForm from './AuthForm'; // Import the login screen

function App() {
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');

  // App State
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || "https://personal-task-manager-j7gm.onrender.com";

  // 1. LOGIN HANDLER
  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    fetchTasks(newToken); // Load data immediately
  };

  // 2. LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setTasks([]); // Clear private data
  };

  // Fetch Tasks (Protected)
  const fetchTasks = async (currentToken) => {
    const t = currentToken || token; // Use token from arg or state
    if (!t) return;

    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        headers: { 'Authorization': `Bearer ${t}` } // Send "ID Card"
      });
      if (res.status === 401) { handleLogout(); return; } // Token expired? Logout
      const data = await res.json();
      setTasks(data);
    } catch (error) { console.error("Error fetching:", error); }
  };

  // Init
  useEffect(() => { if (token) fetchTasks(); }, [token]);

  // CRUD Handlers (Updated to include Token header)
  const updateTask = async (id, updates) => {
    setTasks(tasks.map(t => t._id === id ? { ...t, ...updates } : t));
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/api/tasks/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTasks();
  };

  const handleTaskAdded = () => { fetchTasks(); setActiveView('tasks'); };
  const handleTaskUpdated = (id, updates) => { updateTask(id, updates); setEditingTask(null); setActiveView('tasks'); };

  // Styles
  const styles = {
    appContainer: { display: 'flex', height: '100vh', backgroundColor: 'var(--bg-light)' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
    contentArea: { maxWidth: '1000px', margin: '0 auto' },
    filterbar: { display: 'flex', gap: '15px', marginBottom: '25px' },
    searchInput: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none' },
    filterSelect: { padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none', cursor: 'pointer' }
  };

  // --- IF NOT LOGGED IN, SHOW LOGIN SCREEN ---
  if (!token) {
    return <AuthForm onLogin={handleLogin} />;
  }

  // --- MAIN APP RENDER ---
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard tasks={tasks} onViewAll={() => setActiveView('tasks')} userName={username} />;
      case 'add': return <TaskForm onTaskAdded={handleTaskAdded} onCancel={() => setActiveView('dashboard')} />;
      case 'edit': return <EditTaskForm task={editingTask} onTaskUpdated={handleTaskUpdated} onCancel={() => {setEditingTask(null); setActiveView('tasks');}} />;
      case 'tasks': return (
        <div>
           <div style={styles.filterbar}>
              <input type="text" placeholder="Search tasks..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select style={styles.filterSelect} value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                <option value="All">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {filteredTasks.map(task => <TaskCard key={task._id} task={task} onDelete={handleDelete} onToggleComplete={(id, s) => updateTask(id, {isCompleted: s})} onEdit={(t) => {setEditingTask(t); setActiveView('edit');}} />)}
            </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div style={styles.appContainer}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />
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