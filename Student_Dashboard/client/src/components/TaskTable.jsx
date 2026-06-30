const formatDate = (date) => new Date(date).toLocaleDateString();

const TaskTable = ({ tasks, userRole, onStatusChange, onEdit, onDelete }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Student</th>
          <th>Category</th>
          <th>Priority</th>
          <th>Due Date</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task._id}>
            <td>{task.title}</td>
            <td>{task.assignedTo?.name || 'Unassigned'}</td>
            <td>{task.category}</td>
            <td><span className={`pill priority-${task.priority.toLowerCase()}`}>{task.priority}</span></td>
            <td>{formatDate(task.dueDate)}</td>
            <td>{task.status}</td>
            <td className="table-actions">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!tasks.length && <p className="empty-state">No tasks found.</p>}
  </div>
);

export default TaskTable;
