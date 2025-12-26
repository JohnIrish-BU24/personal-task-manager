import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded, onCancel }) => 
{
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = async (e) => 
{
    e.preventDefault();
    const API_URL = import.meta.env.VITE_API_URL || "https://personal-task-manager-j7gm.onrender.com";
    try {
      await fetch(`${API_URL}/api/tasks`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, priority, deadline }),
        });
      setTitle(''); setDescription(''); setPriority('Medium'); setDeadline('');
      onTaskAdded();
    } catch (error) { console.error("Error adding task:", error); }
  };

  const styles = 
  {
    container: { backgroundColor: 'var(--white)', padding: '30px', borderRadius: '20px', boxShadow: '0px 10px 30px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' },
    header: { marginBottom: '25px', fontSize: '20px', fontWeight: '600' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-gray)', fontWeight: '500' },
    input: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none', backgroundColor: 'var(--bg-light)', fontSize: '14px', fontFamily: 'inherit' },
    select: { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e0e5f2', outline: 'none', backgroundColor: 'var(--bg-light)', fontSize: '14px', cursor: 'pointer' },
    btnGroup: { display: 'flex', gap: '15px', marginTop: '30px' },
    submitBtn: { flex: 1, padding: '14px', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '600', fontSize: '14px', transition: '0.2s', cursor: 'pointer' },
    cancelBtn: { padding: '14px 25px', backgroundColor: 'transparent', color: 'var(--text-gray)', border: '1px solid #e0e5f2', borderRadius: '12px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.header}>Add New Task</h3>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Task Title</label>
          <input style={styles.input} type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g., Review project proposal" />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Description</label>
          <textarea style={styles.input} rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details..." />
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Priority</label>
            <select style={styles.select} value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
            </div>
            <div style={{ ...styles.inputGroup, flex: 1 }}>
            <label style={styles.label}>Deadline</label>
            <input style={styles.input} type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
        </div>
        <div style={styles.btnGroup}>
           <button type="button" onClick={onCancel} style={styles.cancelBtn}>Cancel</button>
           <button type="submit" style={styles.submitBtn}>Create Task</button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
