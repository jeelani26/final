import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import { Box, CircularProgress } from '@mui/material';

const App = () => {
    const { user } = useContext(AuthContext);

    if (user === undefined) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Routes>
                {/* Use leading slashes again */}
                <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={user.role === 'admin' ? '/admin' : '/student'} />} />
                <Route path="/admin" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
                <Route path="/student" element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Box>
    );
};

export default App;