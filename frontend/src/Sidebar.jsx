import React from 'react';

const Sidebar = ({ activeView, setActiveView }) => {
  const icons = {
    dashboard: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    add: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    tasks: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'add', label: 'Add To-Do', icon: icons.add },
    { id: 'tasks', label: 'My Tasks', icon: icons.tasks },
  ];

  const styles = {
    sidebar: {
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--primary-color)',
      color: 'var(--white)',
      height: '100vh',
      padding: '30px 20px',
      display: 'flex',
      flexDirection: 'column',
      borderTopRightRadius: '20px',
      borderBottomRightRadius: '20px',
    },
    title: { fontSize: '22px', fontWeight: '600', marginBottom: '50px', textAlign: 'center' },
    menuList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    menuItem: (isActive) => ({
      display: 'flex', alignItems: 'center', padding: '12px 15px', borderRadius: '12px',
      cursor: 'pointer', transition: 'all 0.3s ease',
      backgroundColor: isActive ? 'var(--white)' : 'transparent',
      color: isActive ? 'var(--primary-color)' : 'var(--white)',
      fontWeight: isActive ? '600' : '400',
    }),
    iconWrapper: { marginRight: '12px', display: 'flex', alignItems: 'center' }
  };

  return (
    <div style={styles.sidebar}>
      <h1 style={styles.title}>Personal Task Manager</h1>
      <ul style={styles.menuList}>
        {menuItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <li 
              key={item.id} 
              style={styles.menuItem(isActive)}
              onClick={() => setActiveView(item.id)}
            >
              <span style={styles.iconWrapper}>{item.icon}</span>
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;