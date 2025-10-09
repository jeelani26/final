import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Button, Typography, Grid, Card, CardContent, CardActions, Paper, TextField, Stack, Chip, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/courses`);
                setCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch courses:", error);
            }
        };
        fetchCourses();
    }, [API_URL]);

    const handleRegister = async (courseId) => {
        try {
            await axios.post(`${API_URL}/api/courses/register`, { studentId: user.id, courseId });
            alert('Registration Successful!');
            const res = await axios.get(`${API_URL}/api/courses`);
            setCourses(res.data);
        } catch (error) {
            alert(`Registration Failed: ${error.response?.data || 'Server error'}`);
        }
    };
    
    const filteredCourses = courses.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Paper elevation={2} sx={{ p: 2, mb: 4, borderRadius: '12px' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <SearchIcon color="action" />
                    <TextField
                        fullWidth
                        variant="standard"
                        placeholder="Search courses, instructors, or course codes..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                    />
                </Stack>
            </Paper>

            <Grid container spacing={3}>
                {filteredCourses.map(course => (
                    <Grid item xs={12} md={6} lg={4} key={course._id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: '12px', boxShadow: 3 }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Typography variant="h6" component="div">
                                        {course.courseCode}: {course.title}
                                    </Typography>
                                    <Chip label={`${course.capacity - course.enrolledStudents.length}/${course.capacity} seats`} color={course.capacity - course.enrolledStudents.length > 0 ? "success" : "error"} variant="outlined" />
                                </Stack>
                                <Typography sx={{ mt: 1, fontStyle: 'italic' }} color="text.secondary">
                                    Prof. {course.instructor}
                                </Typography>
                                <Typography sx={{ mt: 1 }} variant="body2">
                                    {course.credits} Credits
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                {course.schedule.map((slot, index) => (
                                    <Stack key={index} direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                        <Typography variant="body2">
                                            {slot.day}: {slot.startTime} - {slot.endTime}
                                        </Typography>
                                        <Chip label={slot.courseType} size="small" />
                                    </Stack>
                                ))}
                            </CardContent>
                            <CardActions>
                                <Button fullWidth variant="contained" color="primary" onClick={() => handleRegister(course._id)} disabled={course.enrolledStudents.includes(user.id)}>
                                    {course.enrolledStudents.includes(user.id) ? 'Registered' : 'Register'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default CourseList;