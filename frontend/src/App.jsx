import React, { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getMe } from './api'
import AuthForm from './components/AuthForm'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'

function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkUserSession = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userData = await getMe()
      setUser(userData)
      const tasksData = await getTasks()
      setTasks(tasksData)
    } catch (err) {
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkUserSession()
  }, [])

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser)
    try {
      const tasksData = await getTasks()
      setTasks(tasksData)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setTasks([])
  }

  const handleCreateTask = async (taskData) => {
    try {
      const created = await createTask(taskData)
      setTasks((prev) => [created, ...prev])
    } catch (err) {
      alert(err.message)
    }
  }

  const handleToggleComplete = async (id, completed) => {
    try {
      const updated = await updateTask(id, { completed })
      setTasks((prev) => prev.map((t) => (t._id === id ? updated : t)))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id)
      setTasks((prev) => prev.filter((t) => t._id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="center-screen">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-inner">
          <div>
            <h1>Task Management App</h1>
            <p className="subtitle">Practical 7: JWT Authentication & Middleware</p>
          </div>
          {user && (
            <div className="user-area">
              <span>{user.email}</span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="main-content">
        {!user ? (
          <AuthForm onLoginSuccess={handleLoginSuccess} />
        ) : (
          <div className="layout-grid">
            <aside>
              <TaskForm onTaskCreated={handleCreateTask} />
            </aside>
            <section>
              <TaskList
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDeleteTask={handleDeleteTask}
              />
            </section>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>CHARUSAT | ITUE301 Advanced Web Development Frameworks</p>
      </footer>
    </div>
  )
}

export default App
