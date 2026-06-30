const formatDate = (date) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

const TaskCard = ({ task, userRole, onStatusChange, onEdit, onDelete }) => (
  <article className="task-card">
    <div className="task-card-header">
      <div>
        <p className="eyebrow">{task.category}</p>
        <h3>{task.title}</h3>
      </div>
      <span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
    </div>
    <p>{task.description}</p>
    <div className="meta-line">
      <span>Due {formatDate(task.dueDate)}</span>
      <span>{task.status}</span>
      {task.assignedTo?.name && <span>{task.assignedTo.name}</span>}
    </div>
    <div className="card-actions">
      <select value={task.status} onChange={(event) => onStatusChange(task, event.target.value)}>
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
        <option>Cancelled</option>
      </select>
      {userRole === 'admin' && (
        <>
          <button type="button" className="btn mini secondary" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button type="button" className="btn mini danger" onClick={() => onDelete(task)}>
            Delete
          </button>
        </>
      )}
    </div>
    {userRole === 'admin' && task.history?.length > 0 && (
      <details className="history">
        <summary>Task History</summary>
        {task.history.slice().reverse().map((entry) => (
          <p key={entry._id}>
            {entry.action} by {entry.updatedBy} ({entry.status})
          </p>
        ))}
      </details>
    )}
  </article>
);

export default TaskCard;
