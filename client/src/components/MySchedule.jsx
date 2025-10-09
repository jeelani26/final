import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Typography, List, ListItem, Button } from '@mui/material';

const MySchedule = () => {
    const [myCourses, setMyCourses] = useState([]);
    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchMySchedule = async () => {
        if (user) {
            try {
                const res = await axios.get(`${API_URL}/api/courses/my-schedule/${user.id}`);
                setMyCourses(res.data);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        }
    };

    useEffect(() => {
        fetchMySchedule();
    }, [user, API_URL]);

    const handleDrop = async (courseId) => {
        try {
            await axios.post(`${API_URL}/api/courses/drop`, { studentId: user.id, courseId });
            alert('Course dropped successfully!');
            fetchMySchedule();
            window.location.reload(); 
        } catch (error) {
            alert(`Failed to drop course: ${error.response?.data || 'Server error'}`);
        }
    };

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                My Schedule
            </Typography>
            <List>
                {myCourses.length > 0 ? (
                    myCourses.map(course => (
                        <ListItem key={course._id} sx={{ justifyContent: 'space-between' }}>
                            <Typography>
                                {/* THIS IS THE CORRECTED LINE */}
                                <strong>{course.courseCode}: {course.title}</strong> - {course.schedule[0].day}, {course.schedule[0].startTime} to {course.schedule[0].endTime}
                            </Typography>
                            <Button 
                                variant="outlined" 
                                color="warning" 
                                size="small" 
                                onClick={() => handleDrop(course._id)}
                            >
                                Drop
                            </Button>
                        </ListItem>
                    ))
                ) : (
                    <Typography>You are not registered for any courses yet.</Typography>
                )}
            </List>
        </Box>
    );
};

export default MySchedule;