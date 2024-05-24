import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'

const Navbar: React.FC = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">דף בית</Link></li>
                <li><Link to="/login">התחברות</Link></li>
                <li><Link to="/register">הרשמה</Link></li>
                <li><Link to="/student-personal-area">אזור תלמיד</Link></li>
                <li><Link to="/teacher-personal-area">אזור מורה</Link></li>
                <li><Link to="/upload-lesson">העלאת שיעורים</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
