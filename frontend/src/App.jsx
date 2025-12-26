import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import EditTaskForm from './EditTaskForm';
import Dashboard from './Dashboard';
import AuthForm from './AuthForm.jsx';

function App() {
  // --- STATE ---
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState(localStorage.getItem('username') || 'User');
  const [tasks, setTasks] = useState([]); 
  const [activeView, setActiveView] = useState('dashboard');
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');
  
  // NEW: State for the Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  // --- AUTH HANDLERS ---
  const handleLogin = (newToken, newUsername) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('username', newUsername);
    setToken(newToken);
    setUsername(newUsername);
    fetchTasks(newToken); 
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setTasks([]); 
  };

  // --- DELETE ACCOUNT LOGIC ---
  
  // 1. Just opens the modal (doesn't delete yet)
  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  // 2. Actually deletes the account
  const confirmDeleteAccount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/delete`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setShowDeleteModal(false);
        handleLogout(); 
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  // --- DATA HANDLERS ---
  const fetchTasks = async (currentToken) => {
    const t = currentToken || token;
    if (!t) return;
    try {
      const res = await fetch(`${API_URL}/api/tasks`, { headers: { 'Authorization': `Bearer ${t}` } });
      if (res.status === 401) { handleLogout(); return; }
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Error fetching tasks:", error); setTasks([]); }
  };

  useEffect(() => { if (token) fetchTasks(); }, [token]);

  const updateTask = async (id, updates) => {
    setTasks(tasks.map(t => t._id === id ? { ...t, ...updates } : t));
    await fetch(`${API_URL}/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(updates),
    });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    setTasks(tasks.filter(t => t._id !== id)); 
    await fetch(`${API_URL}/api/tasks/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchTasks();
  };

  // --- RENDER HELPERS ---
  if (!token) return <AuthForm onLogin={handleLogin} />;

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterPriority === 'All' || task.priority === filterPriority;
    return matchesSearch && matchesFilter;
  });

  const styles = {
    appContainer: { display: 'flex', height: '100vh', backgroundColor: 'var(--bg-light)' },
    mainContent: { flex: 1, padding: '40px', overflowY: 'auto' },
    contentArea: { maxWidth: '1000px', margin: '0 auto' },
    filterbar: { display: 'flex', gap: '15px', marginBottom: '25px' },
    searchInput: { flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none' },
    filterSelect: { padding: '12px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none' },
    
    // MODAL STYLES
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    modalCard: { backgroundColor: 'white', padding: '30px', borderRadius: '20px', width: '90%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
    modalTitle: { fontSize: '20px', fontWeight: '700', color: '#d32f2f', marginBottom: '10px' },
    modalText: { color: '#666', fontSize: '14px', marginBottom: '25px', lineHeight: '1.5' },
    modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
    btnCancel: { padding: '10px 20px', borderRadius: '10px', border: '1px solid #ccc', backgroundColor: 'white', cursor: 'pointer', fontWeight: '600' },
    btnConfirm: { padding: '10px 20px', borderRadius: '10px', border: 'none', backgroundColor: '#d32f2f', color: 'white', cursor: 'pointer', fontWeight: '600' }
  };

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard tasks={tasks} onViewAll={() => setActiveView('tasks')} userName={username} />;
      case 'add': return <TaskForm onTaskAdded={() => { fetchTasks(); setActiveView('tasks'); }} onCancel={() => setActiveView('dashboard')} />;
      case 'edit': return <EditTaskForm task={editingTask} onTaskUpdated={(id, updates) => { updateTask(id, updates); setEditingTask(null); setActiveView('tasks'); }} onCancel={() => { setEditingTask(null); setActiveView('tasks'); }} />;
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
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout} 
        onDeleteAccount={openDeleteModal} // Connects to the Modal Opener
      />
      <main style={styles.mainContent}>
        <div style={styles.contentArea}>
            <Header title={activeView === 'dashboard' ? 'Dashboard' : activeView === 'add' ? 'Create Task' : activeView === 'edit' ? 'Edit Task' : 'My Tasks'} />
            {renderContent()}
        </div>
      </main>

      {/* --- CONFIRMATION MODAL UI --- */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalTitle}>Delete Account?</div>
            <p style={styles.modalText}>
              Are you sure you want to delete your account? <br/>
              <b>This will permanently erase all your tasks.</b> <br/>
              This action cannot be undone.
            </p>
            <div style={styles.modalButtons}>
              <button style={styles.btnCancel} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button style={styles.btnConfirm} onClick={confirmDeleteAccount}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;