import { useEffect, useState } from 'react';

const initialForm = {
  studentId: '',
  name: '',
  email: '',
  branch: '',
  semester: '',
  section: '',
  profilePhoto: '',
  password: ''
};

const StudentForm = ({ editingStudent, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (editingStudent) {
      setForm({ ...initialForm, ...editingStudent, password: '' });
    } else {
      setForm(initialForm);
    }
  }, [editingStudent]);

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
          <p className="eyebrow">Student</p>
          <h2>{editingStudent ? 'Edit Student' : 'Create Student'}</h2>
        </div>
      </div>
      <label>Student ID<input name="studentId" value={form.studentId} onChange={handleChange} required /></label>
      <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
      <label>Email<input name="email" type="email" value={form.email} onChange={handleChange} required /></label>
      <label>Branch<input name="branch" value={form.branch} onChange={handleChange} required /></label>
      <label>Semester<input name="semester" value={form.semester} onChange={handleChange} required /></label>
      <label>Section<input name="section" value={form.section} onChange={handleChange} required /></label>
      <label>Profile Photo URL<input name="profilePhoto" value={form.profilePhoto} onChange={handleChange} /></label>
      {!editingStudent && (
        <label>Password<input name="password" type="password" value={form.password} onChange={handleChange} required minLength="6" /></label>
      )}
      <div className="form-actions">
        {editingStudent && (
          <button type="button" className="btn secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn primary" disabled={saving}>
          {saving ? 'Saving...' : editingStudent ? 'Update Student' : 'Create Student'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
