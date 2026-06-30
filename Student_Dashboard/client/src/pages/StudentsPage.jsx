import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SearchBar';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';
import StudentTable from '../components/StudentTable';
import {
  createStudent,
  deleteStudent,
  fetchStudents,
  resetPassword,
  updateStudent
} from '../services/studentService';

const StudentsPage = () => {
  const { showToast } = useOutletContext();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ branch: '', semester: '', section: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadStudents = async () => {
    setLoading(true);
    try {
      setStudents(await fetchStudents({ search, ...filters }));
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to load students.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(loadStudents, 250);
    return () => window.clearTimeout(timer);
  }, [search, filters.branch, filters.semester, filters.section]);

  const filterOptions = useMemo(() => {
    const unique = (key) => [...new Set(students.map((student) => student[key]).filter(Boolean))];
    return [
      { name: 'branch', label: 'Branch', values: unique('branch') },
      { name: 'semester', label: 'Semester', values: unique('semester') },
      { name: 'section', label: 'Section', values: unique('section') }
    ];
  }, [students]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editingStudent) {
        const { password, ...safePayload } = payload;
        await updateStudent(editingStudent._id, safePayload);
        showToast('Student updated successfully.');
      } else {
        await createStudent(payload);
        showToast('Student created successfully.');
      }
      setEditingStudent(null);
      await loadStudents();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to save student.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteStudent(deleteTarget._id);
      showToast('Student deleted successfully.');
      setDeleteTarget(null);
      await loadStudents();
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to delete student.', 'error');
    }
  };

  const confirmReset = async () => {
    const newPassword = window.prompt('Enter a new password with at least 6 characters:');
    if (!newPassword) {
      setResetTarget(null);
      return;
    }
    try {
      await resetPassword(resetTarget._id, newPassword);
      showToast('Password reset successfully.');
      setResetTarget(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to reset password.', 'error');
    }
  };

  return (
    <div className="management-page">
      <StudentForm
        editingStudent={editingStudent}
        onSubmit={handleSubmit}
        onCancel={() => setEditingStudent(null)}
        saving={saving}
      />
      <section className="panel">
        <div className="section-title">
          <div>
            <p className="eyebrow">Directory</p>
            <h2>All Students</h2>
          </div>
        </div>
        <div className="toolbar">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, name, email, branch" />
          <FilterBar
            filters={filters}
            onChange={(name, value) => setFilters((current) => ({ ...current, [name]: value }))}
            options={filterOptions}
          />
        </div>
        {loading ? (
          <LoadingSpinner label="Loading students..." />
        ) : (
          <>
            <StudentTable students={students} onEdit={setEditingStudent} onDelete={setDeleteTarget} onReset={setResetTarget} />
            <div className="mobile-list">
              {students.map((student) => (
                <StudentCard
                  key={student._id}
                  student={student}
                  onEdit={setEditingStudent}
                  onDelete={setDeleteTarget}
                  onReset={setResetTarget}
                />
              ))}
            </div>
          </>
        )}
      </section>
      <ConfirmationModal
        open={Boolean(deleteTarget)}
        title="Delete Student"
        message={`Delete ${deleteTarget?.name}? Assigned tasks will also be removed.`}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <ConfirmationModal
        open={Boolean(resetTarget)}
        title="Reset Password"
        message={`Set a new password for ${resetTarget?.name}.`}
        confirmLabel="Continue"
        onCancel={() => setResetTarget(null)}
        onConfirm={confirmReset}
      />
    </div>
  );
};

export default StudentsPage;
