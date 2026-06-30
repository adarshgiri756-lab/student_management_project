const StudentTable = ({ students, onEdit, onDelete, onReset }) => (
  <div className="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Branch</th>
          <th>Semester</th>
          <th>Section</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student._id}>
            <td>{student.studentId}</td>
            <td>{student.name}</td>
            <td>{student.email}</td>
            <td>{student.branch}</td>
            <td>{student.semester}</td>
            <td>{student.section}</td>
            <td className="table-actions">
              <button type="button" className="btn mini secondary" onClick={() => onEdit(student)}>
                Edit
              </button>
              <button type="button" className="btn mini secondary" onClick={() => onReset(student)}>
                Reset
              </button>
              <button type="button" className="btn mini danger" onClick={() => onDelete(student)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    {!students.length && <p className="empty-state">No students found.</p>}
  </div>
);

export default StudentTable;
