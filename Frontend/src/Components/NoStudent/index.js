import React from "react";
import { Link } from "react-router-dom";
import './NoStudent.css';

const NoStudent = () => (
    <div className="no-student p-3 ">
        <h2>No Student Found</h2>
        
        <Link to="/add-student">
            <div>
                <button className="btn btn-primary" type="submit">
                Add Student
              </button>
            </div>
        </Link > 
        <p></p>
    </div>
);

export default NoStudent;