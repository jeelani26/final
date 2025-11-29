import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import {
    Box, Button, Typography, Container, Stack, Grid, Paper, CircularProgress,
    Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton,
    Dialog, DialogTitle, DialogContent
} from '@mui/material';
import axios from 'axios';
import SchoolIcon from '@mui/icons-material/School';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FunctionsIcon from '@mui/icons-material/Functions';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import AdminCourseManager from '../components/AdminCourseManager.jsx';

// StatCard component
const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: '12px' }}>
        <Box sx={{ mr: 2, color: color }}>{icon}</Box>
        <Box>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h5" component="p" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
    </Paper>
);

const AdminDashboard = () => {
    const { logout } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [registrations, setRegistrations] = useState([]);
    const [activeTab, setActiveTab] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchData = async () => {
        try {
            const [statsRes, coursesRes, regsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/stats`),
                axios.get(`${API_URL}/api/courses`), // Get all courses for admin
                axios.get(`${API_URL}/api/admin/registrations`)
            ]);
            setStats(statsRes.data);
            setCourses(coursesRes.data);
            setRegistrations(regsRes.data);
        } catch (error) { console.error("Failed to fetch admin data:", error); }
    };

    useEffect(() => { fetchData(); }, [API_URL]);

    const handleTabChange = (event, newValue) => { setActiveTab(newValue); };

    const handleDeleteCourse = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`${API_URL}/api/courses/${courseId}`);
                alert('Course deleted successfully!');
                fetchData();
            } catch (error) { alert(`Failed to delete course: ${error.response?.data || 'Server error'}`); }
        }
    };

    const handleRemoveRegistration = async (studentId, courseId) => {
         if (window.confirm("Are you sure you want to remove this student's registration?")) {
            try {
                await axios.post(`${API_URL}/api/courses/drop`, { studentId, courseId });
                alert('Registration removed successfully!');
                fetchData();
            } catch (error) { alert(`Failed to remove registration: ${error.response?.data || 'Server error'}`); }
        }
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <Container maxWidth="xl">
            <Box sx={{ my: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Admin Dashboard</Typography>
                    <Button variant="contained" color="error" onClick={logout}>Logout</Button>
                </Stack>

                {stats ? (
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Courses" value={stats.totalCourses} icon={<SchoolIcon sx={{ fontSize: 40 }} />} color="primary.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><StatCard title="Total Enrollments" value={stats.totalEnrollments} icon={<GroupIcon sx={{ fontSize: 40 }} />} color="success.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><StatCard title="Avg. Enrollment" value={stats.avgEnrollment} icon={<FunctionsIcon sx={{ fontSize: 40 }} />} color="warning.main" /></Grid>
                        <Grid item xs={12} sm={6} md={3}><StatCard title="Schedule Conflicts" value={stats.scheduleConflicts} icon={<ErrorOutlineIcon sx={{ fontSize: 40 }} />} color="error.main" /></Grid>
                    </Grid>
                ) : <CircularProgress />}

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}><Tab label="Course Management" /><Tab label="Registration Management" /></Tabs>
                </Box>

                {activeTab === 0 && (
                    <Box sx={{ mt: 4 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Course Management</Typography>
                            <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenModal}>Add Course</Button>
                        </Stack>
                        <TableContainer component={Paper}>
                            <Table><TableHead><TableRow><TableCell>Course</TableCell><TableCell>Year</TableCell><TableCell>Instructor</TableCell><TableCell>Enrollment</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                                <TableBody>
                                    {courses.map((course) => (<TableRow key={course._id}><TableCell>{course.courseCode}: {course.title}</TableCell><TableCell>{course.year}</TableCell><TableCell>{course.instructor}</TableCell><TableCell>{course.enrolledStudents.length} / {course.capacity}</TableCell><TableCell><Chip label={course.enrolledStudents.length >= course.capacity ? "Full" : "Available"} color={course.enrolledStudents.length >= course.capacity ? "error" : "success"} /></TableCell><TableCell align="right"><IconButton color="error" onClick={() => handleDeleteCourse(course._id)}><DeleteIcon /></IconButton></TableCell></TableRow>))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                {activeTab === 1 && (
                    <TableContainer component={Paper} sx={{ mt: 4 }}>
                        <Table><TableHead><TableRow><TableCell>Student</TableCell><TableCell>Course</TableCell><TableCell>Status</TableCell><TableCell align="right">Actions</TableCell></TableRow></TableHead>
                            <TableBody>
                                {registrations.map((reg) => (<TableRow key={reg.id}><TableCell>{reg.studentName}</TableCell><TableCell>{reg.courseCode}: {reg.courseTitle}</TableCell><TableCell><Chip label={reg.status} color="success" /></TableCell><TableCell align="right"><IconButton color="warning" onClick={() => handleRemoveRegistration(reg.studentId, reg.courseId)}><DeleteIcon /></IconButton></TableCell></TableRow>))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
                    <DialogTitle>Add New Course</DialogTitle>
                    <DialogContent><AdminCourseManager onClose={handleCloseModal} /></DialogContent>
                </Dialog>
            </Box>
        </Container>
    );
};
export default AdminDashboard;
