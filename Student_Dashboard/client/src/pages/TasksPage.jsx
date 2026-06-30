import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import TaskTable from '../components/TaskTable';
import { useAuth } from '../context/AuthContext';
import { fetchStudents } from '../services/studentService';
import { createTask, deleteTask, fetchTasks, updateTask } from '../services/taskService';

const taskFilters = [
  { name: 'status', label: 'Status', values: ['Pending', 'In Progress', 'Completed', 'Cancelled'] },
  { name: 'priority', label: 'Priority', values: ['High', 'Medium', 'Low'] },
  { name: 'category', label: 'Category', values: ['Study', 'Assignment', 'Exam', 'Project'] }
];

const TasksPage = () => {
  const { user } = useAuth();
  const { showToast } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [students, setStudents] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', category: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTasks(await fetchTasks({ search, ...filters }));
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load tasks.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    if (user?.role === 'admin') {
      try {
        setStudents(await fetchStudents());
      } catch (error) {
        showToast('Unable to load student list.', 'error');
      }
    }
  };

  useEffect(() => {
    loadStudents();
  }, [user?.role]);

  useEffect(() => {
    const timer = window.setTimeout(loadTasks, 250);
    return () => window.clearTimeout(timer);
  }, [search, filters.status, filters.priority, filters.category]);

  const handleTaskSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask._id, payload);
        showToast('Task updated successfully.');
      } else {
        await createTask(payload);
        showToast('Task assigned successfully.');
      }
      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to save task.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (task, status) => {
    try {
      await updateTask(task._id, { status });
      showToast('Task status updated.');
      await loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update task.', 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteTarget._id);
      showToast('Task deleted successfully.');
      setDeleteTarget(null);
      await loadTasks();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete task.', 'error');
    }
  };

  return (
    <div className="management-page">
      {user?.role === 'admin' && (
        <TaskForm
          editingTask={editingTask}
          students={students}
          onSubmit={handleTaskSubmit}
          onCancel={() => setEditingTask(null)}
          saving={saving}
        />
      )}
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Tasks</p>
            <h2>{user?.role === 'admin' ? 'All Tasks' : 'My Tasks'}</h2>
          </div>
        </div>
        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search title, category, priority" />
          <FilterBar
            filters={filters}
            onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
            options={taskFilters}
          />
        </div>
        {loading ? (
          <LoadingSpinner label="Loading tasks..." />
        ) : (
          <>
            <TaskTable
              tasks={tasks}
              userRole={user?.role}
              onStatusChange={handleStatusChange}
              onEdit={setEditingTask}
              onDelete={setDeleteTarget}
            />
            <div className="mobile-list task-list">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  userRole={user?.role}
                  onStatusChange={handleStatusChange}
                  onEdit={setEditingTask}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}" permanently?`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TasksPage;
