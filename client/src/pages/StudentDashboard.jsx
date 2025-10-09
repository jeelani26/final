// client/src/pages/StudentDashboard.jsx
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Button, Typography, Container, Stack, Paper } from '@mui/material';
import { BookOpen, Clock } from 'lucide-react';
import axios from 'axios';
import MySchedule from '../components/MySchedule.jsx';
import CourseList from '../components/CourseList.jsx';

const StudentDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('browse');
    const [myCourses, setMyCourses] = useState([]);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (user) {
            const fetchMySchedule = async () => {
                const res = await axios.get(`${API_URL}/api/courses/my-schedule/${user.id}`);
                setMyCourses(res.data);
            };
            fetchMySchedule();
        }
    }, [user, API_URL]);

    const totalCredits = useMemo(() => myCourses.reduce((sum, course) => sum + course.credits, 0), [myCourses]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" component="h1">Welcome back, {user?.username}</Typography>
                    <Typography color="text.secondary">Plan your courses for the upcoming semester</Typography>
                </Box>
                <Button variant="contained" color="error" onClick={logout}>Logout</Button>
            </Stack>

            <Stack direction="row" spacing={4} mb={4}>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{totalCredits}</Typography>
                    <Typography variant="caption" color="text.secondary">Credits</Typography>
                </Paper>
                <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">{myCourses.length}</Typography>
                    <Typography variant="caption" color="text.secondary">Courses</Typography>
                </Paper>
            </Stack>

            <Stack direction="row" spacing={1} mb={4}>
                <Button
                    variant={activeTab === 'browse' ? 'contained' : 'outlined'}
                    startIcon={<BookOpen size={16} />}
                    onClick={() => setActiveTab('browse')}
                >
                    Browse Courses
                </Button>
                <Button
                    variant={activeTab === 'schedule' ? 'contained' : 'outlined'}
                    startIcon={<Clock size={16} />}
                    onClick={() => setActiveTab('schedule')}
                >
                    My Schedule
                </Button>
            </Stack>

            {/* Main Content Area */}
            <Box>
                {activeTab === 'browse' ? <CourseList enrolledCourses={myCourses} /> : <MySchedule enrolledCourses={myCourses} />}
            </Box>
        </Container>
    );
};

export default StudentDashboard;