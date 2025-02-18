import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { BsTrash3 } from "react-icons/bs";
import NoStudent from "../../Components/NoStudent";

export default function Home() {
  const [students, setStudents] = useState([]);
  const [isEditing, setIsEditing] = useState(null); // State to handle which student is being edited
  const [editStudent, setEditStudent] = useState({ name: "", nim: "", gender: "" });

  useEffect(() => {
    const getStudents = () => {
      axios
        .get(`http://localhost:8070/student/get`)
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => alert(err.message));
    };
    getStudents();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditStudent({ ...editStudent, [name]: value });
  };

  const saveEdit = (id) => {
    // Update student details
    axios
      .put(`http://localhost:8070/student/update/${id}`, editStudent)
      .then((res) => {
        Swal.fire("Updated!", res.data.status, "success");
        // Refresh students list after update
        setStudents(students.map((student) => (student._id === id ? { ...student, ...editStudent } : student)));
        setIsEditing(null);
      })
      .catch((err) => Swal.fire("Update Failed", err.message, "error"));
  };

  const cancelEdit = () => {
    setIsEditing(null); // Cancel editing
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:8070/student/delete/${id}`)
          .then((res) => {
            Swal.fire("Deleted!", res.data.status, "success");
            // Remove deleted student from the list
            setStudents(students.filter((student) => student._id !== id));
          })
          .catch((err) => {
            Swal.fire("Not Deleted!", err.message, "error");
          });
      }
    });
  };

  return (
    <div className="text-center mb-4">
      <h5 style={{ textAlign: "center", padding: "3rem" }}>Student Attendance Management System</h5>
      <div className="container">
        {students.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Rollno</th>
                <th scope="col">Gender</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((item, index) => (
                <tr key={item._id}>
                  <td style={{ color: "red" }}>{index + 1}</td>
                  {/* Inline edit form */}
                  {isEditing === item._id ? (
                    <>
                      <td>
                        <input
                          type="text"
                          name="name"
                          value={editStudent.name}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          name="nim"
                          value={editStudent.nim}
                          onChange={handleEditChange}
                          className="form-control"
                        />
                      </td>
                      <td>
                        <select
                          name="gender"
                          value={editStudent.gender}
                          onChange={handleEditChange}
                          className="form-control"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </td>
                      <td>
                        <button className="btn btn-success" onClick={() => saveEdit(item._id)}>
                          Save
                        </button>
                        <button className="btn btn-secondary ms-2" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{item.name}</td>
                      <td>{item.nim}</td>
                      <td>{item.gender}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setIsEditing(item._id);
                            setEditStudent({ name: item.name, nim: item.nim, gender: item.gender });
                          }}
                        >
                          <FaRegEdit className="d-flex align-items-center justify-content-center" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger ms-2"
                          onClick={() => deleteUser(item._id)}
                        >
                          <BsTrash3 className="d-flex align-items-center justify-content-center" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoStudent />
        )}
      </div>
    </div>
  );
}