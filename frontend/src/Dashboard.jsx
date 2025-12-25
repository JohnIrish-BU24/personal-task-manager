import React from 'react';

const DashboardTaskItem = ({ task, onClick }) => {
  const getPriorityColor = (p) => {
    switch (p) { case 'High': return '#d32f2f'; case 'Medium': return '#ed6c02'; default: return '#2e7d32'; }
  };
  
  const styles = {
    item: { 
      padding: '12px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', 
      alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer',
      ':last-child': { borderBottom: 'none' }
    },
    left: { display: 'flex', alignItems: 'center', gap: '10px' },
    circle: { width: '10px', height: '10px', borderRadius: '50%', border: `2px solid ${getPriorityColor(task.priority)}` },
    title: { fontSize: '14px', fontWeight: '500', color: 'var(--text-dark)' },
    meta: { fontSize: '11px', color: 'var(--text-gray)' }
  };

  return (
    <div style={styles.item} onClick={onClick}>
      <div style={styles.left}>
        <div style={styles.circle}></div>
        <div>
           <div style={styles.title}>{task.title}</div>
           <div style={styles.meta}>{task.priority} Priority</div>
        </div>
      </div>
      <div style={{color: '#ccc', fontSize: '18px'}}>›</div>
    </div>
  );
};

const Dashboard = ({ tasks, onViewAll, userName }) => { // Added userName prop here to be dynamic
  // 1. Dynamic Greeting
  const hour = new Date().getHours();
  const getGreeting = () => {
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // 2. Filter Logic
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  
  // Tasks due TODAY (and not completed)
  const todayTasks = tasks.filter(t => {
    if (!t.deadline || t.isCompleted) return false;
    const tDate = new Date(t.deadline).toISOString().slice(0, 10);
    return tDate === today;
  });

  // Tasks with NO DATE (and not completed)
  const noDateTasks = tasks.filter(t => !t.deadline && !t.isCompleted);

  // Stats
  const total = tasks.length;
  const completed = tasks.filter(t => t.isCompleted).length;
  const percentDone = total === 0 ? 0 : Math.round((completed / total) * 100);

  const styles = {
    container: { maxWidth: '1100px', margin: '0 auto' },
    header: { marginBottom: '30px' },
    welcome: { fontSize: '26px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '5px' },
    subWelcome: { color: 'var(--text-gray)', fontSize: '14px' },
    
    // Main Grid Layout
    grid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' },
    
    box: { backgroundColor: 'var(--white)', borderRadius: '20px', padding: '25px', boxShadow: '0px 4px 20px rgba(0,0,0,0.03)', marginBottom: '25px' },
    boxTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
    boxIcon: { color: 'var(--primary-color)', fontSize: '16px' }, 
    
    emptyText: { fontSize: '13px', color: '#ccc', fontStyle: 'italic', textAlign: 'center', padding: '20px' },

    // Stats Circle 
    circleChart: {
      width: '100px', height: '100px', borderRadius: '50%', 
      background: `conic-gradient(var(--primary-color) ${percentDone}%, #f0f0f0 0)`,
      margin: '0 auto 15px auto', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    innerCircle: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px' },
    statText: { textAlign: 'center', fontSize: '14px', color: 'var(--text-gray)' }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.welcome}>{getGreeting()}, {userName || 'User'}! 👋</h1>
        <p style={styles.subWelcome}>Here is your daily briefing.</p>
      </div>

      <div style={styles.grid}>
        
        {/* LEFT COLUMN: To-Do Lists */}
        <div>
            {/* Box 1: Due Today */}
            <div style={styles.box}>
                <div style={styles.boxTitle}>
                    <span style={styles.boxIcon}>📅</span> To-Do Today
                </div>
                {todayTasks.length === 0 ? (
                    <div style={styles.emptyText}>No tasks due today.</div>
                ) : (
                    <div>
                        {todayTasks.map(task => <DashboardTaskItem key={task._id} task={task} onClick={onViewAll} />)}
                    </div>
                )}
            </div>

            {/* Box 2: No Deadline / Backlog */}
            <div style={styles.box}>
                <div style={styles.boxTitle}>
                    <span style={styles.boxIcon}>📄</span> Tasks (No Deadline)
                </div>
                {noDateTasks.length === 0 ? (
                    <div style={styles.emptyText}>No backlog tasks.</div>
                ) : (
                    <div>
                        {noDateTasks.slice(0, 5).map(task => <DashboardTaskItem key={task._id} task={task} onClick={onViewAll} />)}
                        {noDateTasks.length > 5 && <div style={{textAlign:'center', fontSize:'12px', color:'blue', marginTop:'10px', cursor:'pointer'}} onClick={onViewAll}>+ {noDateTasks.length - 5} more</div>}
                    </div>
                )}
            </div>
        </div>

        {/* RIGHT COLUMN: Stats */}
        <div>
            <div style={styles.box}>
                <div style={styles.boxTitle}>
                    <span style={styles.boxIcon}>📊</span> Status
                </div>
                <div style={styles.circleChart}>
                    <div style={styles.innerCircle}>{percentDone}%</div>
                </div>
                <div style={styles.statText}>Tasks Completed</div>
                <div style={{marginTop: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px'}}>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'8px'}}>
                        <span>Total Tasks</span>
                        <strong>{total}</strong>
                    </div>
                    <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px'}}>
                        <span>Completed</span>
                        <strong style={{color:'green'}}>{completed}</strong>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;