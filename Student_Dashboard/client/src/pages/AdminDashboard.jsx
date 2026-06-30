import { useEffect, useState } from 'react';
import DashboardCard from '../components/DashboardCard';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { fetchStats } from '../services/statsService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        setStats(await fetchStats());
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <LoadingSpinner label="Loading dashboard..." />;

  const currentDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="dashboard-page">
      <section className="welcome-band">
        <div>
          <p className="eyebrow">{currentDate}</p>
          <h2>{user?.role === 'admin' ? 'Admin Dashboard' : `Welcome ${user?.name}`}</h2>
        </div>
        <div className="progress-ring">
          <strong>{stats?.completionPercentage || 0}%</strong>
          <span>Task Progress</span>
        </div>
      </section>
      <section className="stats-grid">
        {user?.role === 'admin' && <DashboardCard title="Total Students" value={stats?.totalStudents} tone="purple" />}
        <DashboardCard title="Total Tasks" value={stats?.totalTasks} tone="blue" />
        <DashboardCard title="Completed" value={stats?.completedTasks} tone="green" />
        <DashboardCard title="Pending" value={stats?.pendingTasks} tone="amber" />
        <DashboardCard title="Overdue" value={stats?.overdueTasks} tone="red" />
      </section>
      <section className="dashboard-columns">
        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Activity</p>
              <h2>Recent Activity</h2>
            </div>
          </div>
          <div className="activity-list">
            {stats?.recentTasks?.map((task) => (
              <div key={task._id} className="activity-item">
                <strong>{task.title}</strong>
                <span>{task.status} • {task.assignedTo?.name || 'Student'}</span>
              </div>
            ))}
            {!stats?.recentTasks?.length && <p className="empty-state">No recent activity.</p>}
          </div>
        </div>
        <div className="panel">
          <div className="section-title">
            <div>
              <p className="eyebrow">Today</p>
              <h2>Today's Tasks</h2>
            </div>
          </div>
          <div className="task-list">
            {stats?.todaysTasks?.map((task) => (
              <TaskCard key={task._id} task={task} userRole={user?.role} onStatusChange={() => {}} onEdit={() => {}} onDelete={() => {}} />
            ))}
            {!stats?.todaysTasks?.length && <p className="empty-state">No tasks due today.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
