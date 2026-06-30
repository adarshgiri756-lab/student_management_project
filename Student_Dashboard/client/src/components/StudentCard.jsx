const StudentCard = ({ student, onEdit, onDelete, onReset }) => (
  <article className="item-card">
    <div>
      <p className="eyebrow">{student.studentId}</p>
      <h3>{student.name}</h3>
      <p>{student.email}</p>
    </div>
    <div className="meta-line">
      <span>{student.branch}</span>
      <span>Sem {student.semester}</span>
      <span>Sec {student.section}</span>
    </div>
    <div className="card-actions">
      <button type="button" className="btn mini secondary" onClick={() => onEdit(student)}>
        Edit
      </button>
      <button type="button" className="btn mini secondary" onClick={() => onReset(student)}>
        Reset
      </button>
      <button type="button" className="btn mini danger" onClick={() => onDelete(student)}>
        Delete
      </button>
    </div>
  </article>
);

export default StudentCard;
