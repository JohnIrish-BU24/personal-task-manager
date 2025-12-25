import React from 'react';

const TaskCard = ({ task, onDelete, onToggleComplete, onEdit }) => 
{
  const isDone = task.isCompleted;
  
  const formatDate = (dateString) => 
{
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityStyle = (p) => 
{
    switch (p) {
      case 'High': return { bg: '#ffe0e0', color: '#d32f2f' };
      case 'Medium': return { bg: '#fff4e5', color: '#ed6c02' };
      case 'Low': return { bg: '#e8f5e9', color: '#2e7d32' };
      default: return { bg: '#eee', color: '#666' };
    }
  };
  const pStyle = getPriorityStyle(task.priority);

  const styles = 
  {
    card: 
    {
      backgroundColor: 'var(--white)', padding: '20px', borderRadius: '16px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between',
      alignItems: 'flex-start', opacity: isDone ? 0.6 : 1, transition: 'all 0.3s ease',
    },
    content: { flex: 1, paddingRight: '15px' },
    title: { fontSize: '16px', fontWeight: '600', marginBottom: '6px', textDecoration: isDone ? 'line-through' : 'none', color: isDone ? '#888' : 'var(--text-dark)' },
    desc: { color: 'var(--text-gray)', fontSize: '13px', marginBottom: '12px', lineHeight: '1.4' },
    meta: { display: 'flex', alignItems: 'center', gap: '10px' },
    priorityTag: { backgroundColor: pStyle.bg, color: pStyle.color, padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '600' },
    dateTag: { fontSize: '11px', color: 'var(--text-gray)', display: 'flex', alignItems: 'center', gap: '4px' },
    actions: { display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', minWidth: '80px' },
    
    // Clean Text Buttons (No Icons)
    actionBtn: (color, isBordered) => (
    {
      cursor: 'pointer', fontSize: '12px', color: color, fontWeight: '500', 
      background: 'none', border: isBordered ? `1px solid ${color}` : 'none',
      padding: isBordered ? '5px 10px' : '5px', borderRadius: '6px', transition: '0.2s',
      textAlign: 'right'
    }),
    completeBtn: 
    {
      display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
      fontSize: '12px', color: isDone ? 'green' : 'var(--text-gray)', fontWeight: '500',
      background: 'none', border: 'none'
    },
    checkCircle: 
    {
      width: '14px', height: '14px', borderRadius: '50%', border: isDone ? '2px solid green' : '2px solid #ccc',
      backgroundColor: isDone ? 'green' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '9px'
    }
  
};

  return (
    <div style={styles.card}>
      <div style={styles.content}>
        <h3 style={styles.title}>{task.title}</h3>
        <p style={styles.desc}>{task.description}</p>
        <div style={styles.meta}>
            <span style={styles.priorityTag}>{task.priority}</span>
            {task.deadline && (
                <span style={styles.dateTag}>
                    🕒 {formatDate(task.deadline)}
                </span>
            )}
        </div>
      </div>
      
      <div style={styles.actions}>
        <button style={styles.completeBtn} onClick={() => onToggleComplete(task._id, !isDone)}>
            <div style={styles.checkCircle}>{isDone ? '✓' : ''}</div> {isDone ? 'Done' : 'Mark Done'}
        </button>
        <button style={styles.actionBtn('var(--primary-color)', true)} onClick={() => onEdit(task)}>
            Edit
        </button>
        <button style={styles.actionBtn('#ff4d4d', true)} onClick={() => onDelete(task._id)}>
            Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
