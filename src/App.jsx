import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [age, setAge] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function fetchStudents() {
    const response = await axios.get("http://localhost:5000/students");
    setStudents(response.data);
  }

  useEffect(() => {
    fetchStudents().catch(() => {
      setError("Could not load students. Check that the server is running.");
    });
  }, []);

  function resetForm() {
    setName("");
    setCourse("");
    setAge("");
    setEditingId(null);
  }

  async function saveStudent(event) {
    event.preventDefault();
    setError("");

    const studentData = {
      name: name.trim(),
      course: course.trim(),
      age: Number(age),
    };

    try {
      if (editingId === null) {
        await axios.post("http://localhost:5000/students", studentData);
      } else {
        await axios.put(
          `http://localhost:5000/students/${editingId}`,
          studentData
        );
      }

      resetForm();
      await fetchStudents();
    } catch (error) {
      setError(error.response?.data?.message || "Could not save the student.");
    }
  }

  function editStudent(student) {
    setName(student.name);
    setCourse(student.course);
    setAge(student.age);
    setEditingId(student._id);
    setError("");
  }

  async function deleteStudent(id) {
    setError("");

    try {
      await axios.delete(`http://localhost:5000/students/${id}`);

      if (editingId === id) {
        resetForm();
      }

      await fetchStudents();
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not delete the student."
      );
    }
  }

  return (
    <div>
      <h1>Student Management System</h1>

      <h2>{editingId === null ? "Add Student" : "Edit Student"}</h2>

      <form onSubmit={saveStudent}>
        <div>
          <label htmlFor="name">Name: </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="course">Course: </label>
          <input
            id="course"
            type="text"
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="age">Age: </label>
          <input
            id="age"
            type="number"
            min="0"
            step="1"
            value={age}
            onChange={(event) => setAge(event.target.value)}
            required
          />
        </div>

        <button type="submit">
          {editingId === null ? "Add Student" : "Update Student"}
        </button>

        {editingId !== null && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      {error && <p role="alert">{error}</p>}

      <h2>Students</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>Name: {student.name}</p>
          <p>Course: {student.course}</p>
          <p>Age: {student.age}</p>

          <button type="button" onClick={() => editStudent(student)}>
            Edit
          </button>

          <button type="button" onClick={() => deleteStudent(student._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
