import React from 'react';

const Header = ({ title }) => {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateStr = today.toLocaleDateString(undefined, options);
  const timeStr = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const styles = {
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    pageTitle: {
      fontSize: '28px',
      fontWeight: '600',
      color: 'var(--text-dark)',
    },
    dateTimeContainer: {
      textAlign: 'right',
      color: 'var(--text-gray)',
    },
    date: { fontWeight: '500', color: 'var(--text-dark)' },
    time: { fontSize: '14px' }
  };

  return (
    <div style={styles.headerContainer}>
      <h2 style={styles.pageTitle}>{title}</h2>
      <div style={styles.dateTimeContainer}>
        <div style={styles.date}>{dateStr}</div>
        <div style={styles.time}>{timeStr}</div>
      </div>
    </div>
  );
};

export default Header;