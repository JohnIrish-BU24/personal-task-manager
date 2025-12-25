import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  // 1. Get the URL from the .env file
  const API_URL = import.meta.env.VITE_API_URL

  // 2. Fetch tasks from the Backend
  useEffect(() => {
    fetch(`${API_URL}/api/tasks`)
      .then(response => response.json())
      .then(data => {
        setTasks(data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Error fetching tasks:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Personal Task Manager</h1>
      
      {loading ? (
        <p>Loading tasks from the cloud...</p>
      ) : (
        <div>
          {tasks.length === 0 ? (
            <p>No tasks found. The database is connected but empty!</p>
          ) : (
            <ul>
              {tasks.map(task => (
                <li key={task._id}>
                  <strong>{task.title}</strong> - {task.priority}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default App