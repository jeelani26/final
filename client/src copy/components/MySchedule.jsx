import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Paper, Typography } from '@mui/material';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';

// Utility to convert day names to numbers
const dayNameToNumber = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

const MySchedule = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const fetchMySchedule = async () => {
        if (user) {
            try {
                const res = await axios.get(`${API_URL}/api/courses/my-schedule/${user.id}`);
                const formattedEvents = res.data.flatMap(course => 
                    course.schedule.map(slot => ({
                        id: course._id, // Store courseId
                        title: `${course.courseCode}\n${course.title}`,
                        daysOfWeek: [dayNameToNumber[slot.day]],
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                        backgroundColor: '#3788d8',
                        borderColor: '#3788d8'
                    }))
                );
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        }
    };

    useEffect(() => {
        fetchMySchedule();
    }, [user, API_URL]);

    const handleDrop = async (clickInfo) => {
        const courseId = clickInfo.event.id;
        if (window.confirm(`Are you sure you want to drop this course?`)) {
             try {
                await axios.post(`${API_URL}/api/courses/drop`, { studentId: user.id, courseId });
                alert('Course dropped successfully!');
                fetchMySchedule(); // Refresh calendar
                window.location.reload(); // Easiest way to refresh CourseList
            } catch (error) {
                alert(`Failed to drop course: ${error.response?.data || 'Server error'}`);
            }
        }
    };

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Weekly Schedule
            </Typography>
            <Paper elevation={3} sx={{ p: 2, borderRadius: '12px' }}>
                <FullCalendar
                    plugins={[timeGridPlugin]}
                    initialView="timeGridWeek"
                    
                    // --- THESE ARE THE CHANGES ---
                    headerToolbar={false} // Hides the top toolbar (e.g., "Oct 27-31")
                    dayHeaderFormat={{ weekday: 'long' }} // Shows "Monday" instead of "Mon 10/27"
                    // --- END OF CHANGES ---

                    weekends={false}
                    allDaySlot={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="18:00:00"
                    events={events}
                    eventContent={(arg) => (
                        <Box sx={{ p: 0.5, whiteSpace: 'pre-wrap' }}>
                            <b>{arg.timeText}</b>
                            <Typography variant="body2">{arg.event.title}</Typography>
                        </Box>
                    )}
                    eventClick={handleDrop}
                />
            </Paper>
        </Box>
    );
};

export default MySchedule;