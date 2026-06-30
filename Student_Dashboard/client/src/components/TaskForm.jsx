import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  priority: 'Medium',
  category: 'Study',
  dueDate: '',
  status: 'Pending',
  assignedTo: ''
};

const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : '');

const TaskForm = ({ editingTask, students, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title || '',
        description: editingTask.description || '',
        priority: editingTask.priority || 'Medium',
        category: editingTask.category || 'Study',
        dueDate: toDateInput(editingTask.dueDate),
        status: editingTask.status || 'Pending',
        assignedTo: editingTask.assignedTo?._id || editingTask.assignedTo || ''
      });
    } else {
      setForm(initialForm);
    }
  }, [editingTask]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <div className="section-title">
        <div>
          <p className="eyebrow">Task</p>
          <h2>{editingTask ? 'Edit Task' : 'Assign Task'}</h2>
        </div>
      </div>
      <label>Title<input name="title" value={form.title} onChange={handleChange} required /></label>
      <label>Description<textarea name="description" value={form.description} onChange={handleChange} required /></label>
      <label>
        Assigned To
        <select name="assignedTo" value={form.assignedTo} onChange={handleChange} required>
          <option value="">Select student</option>
          {students.map((student) => (
            <option key={student._id} value={student._id}>
              {student.name} ({student.studentId})
            </option>
          ))}
        </select>
      </label>
      <label>Priority<select name="priority" value={form.priority} onChange={handleChange}><option>Low</option><option>Medium</option><option>High</option></select></label>
      <label>Category<select name="category" value={form.category} onChange={handleChange}><option>Study</option><option>Assignment</option><option>Exam</option><option>Project</option></select></label>
      <label>Due Date<input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} required /></label>
      {editingTask && (
        <label>Status<select name="status" value={form.status} onChange={handleChange}><option>Pending</option><option>In Progress</option><option>Completed</option><option>Cancelled</option></select></label>
      )}
      <div className="form-actions">
        {editingTask && (
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving...' : editingTask ? 'Update Task' : 'Assign Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
