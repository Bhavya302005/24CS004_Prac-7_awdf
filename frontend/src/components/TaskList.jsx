import React from 'react'

function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  const handleDelete = (task) => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      onDeleteTask(task._id)
    }
  }

  if (tasks.length === 0) {
    return (
      <div className="card empty-state">
        <p>No tasks yet. Create one on the left!</p>
      </div>
    )
  }

  return (
    <div className="card task-list-card">
      <h3>Your Tasks ({tasks.length})</h3>
      <div className="task-items">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={task.completed ? 'task-row completed' : 'task-row'}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task._id, !task.completed)}
            />
            <div className="task-info">
              <div className="task-title-line">
                <span className={task.completed ? 'line-through' : ''}>
                  {task.title}
                </span>
                <span className={`priority-tag priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>
              {task.description && (
                <p className="task-desc">{task.description}</p>
              )}
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDelete(task)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskList
