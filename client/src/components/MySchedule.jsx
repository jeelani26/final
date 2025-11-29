import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext.jsx';
import { Box, Paper, Typography } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import './MySchedule.css'; // Your professional styling

// A professional color palette for events
const eventColors = [
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
];

const dayNameToNumber = {
    'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6
};

const MySchedule = () => {
    const [events, setEvents] = useState([]);
    const { user } = useContext(AuthContext);
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchMySchedule = async () => {
            if (user) {
                try {
                    // FIX: Using backticks (`) for template literals
                    const res = await axios.get(`${API_URL}/api/courses/my-schedule/${user.id}`);
                    
                    const formattedEvents = res.data.flatMap((course, index) => {
                        const color = eventColors[index % eventColors.length];
                        
                        return course.schedule.map(slot => ({
                            id: course._id,
                            title: course.title,
                            extendedProps: { 
                                code: course.courseCode,
                                room: course.room || 'TBD'
                            },
                            daysOfWeek: [dayNameToNumber[slot.day]],
                            startTime: slot.startTime,
                            endTime: slot.endTime,
                            backgroundColor: color,
                            borderColor: color,
                        }));
                    });
                    setEvents(formattedEvents);
                } catch (error) {
                    console.error("Failed to fetch schedule:", error);
                }
            }
        };
        fetchMySchedule();
    }, [user, API_URL]);

    const handleDrop = async (clickInfo) => {
        const courseId = clickInfo.event.id;
        const courseCode = clickInfo.event.extendedProps.code;
        
        if (window.confirm(`Are you sure you want to drop ${courseCode}?`)) {
             try {
                // FIX: Using backticks (`) for template literals here too
                await axios.post(`${API_URL}/api/courses/drop`, { studentId: user.id, courseId });
                alert('Course dropped successfully!');
                window.location.reload();
            } catch (error) {
                alert(`Failed to drop course: ${error.response?.data || 'Server error'}`);
            }
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: '500', letterSpacing: '0.5px', color: '#fff' }}>
                Weekly Timetable
            </Typography>
            
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 0, 
                    borderRadius: '16px', 
                    backgroundColor: '#1e1e1e', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    overflow: 'hidden'
                }}
            >
                <div style={{ padding: '20px' }}>
                    <FullCalendar
                        plugins={[timeGridPlugin]}
                        initialView="timeGridWeek"
                        headerToolbar={false}
                        dayHeaderFormat={{ weekday: 'long' }}
                        weekends={false}
                        allDaySlot={false}
                        slotMinTime="08:00:00"
                        slotMaxTime="18:00:00"
                        height="auto"
                        events={events}
                        eventClick={handleDrop}
                        eventContent={(arg) => (
                            <Box sx={{ p: 0.5, lineHeight: 1.3 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', fontSize: '0.75rem', display: 'block' }}>
                                    {arg.event.extendedProps.code}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.70rem', display: 'block', opacity: 0.9, mt: 0.2 }}>
                                    {arg.event.title}
                                </Typography>
                                <Typography variant="caption" sx={{ fontSize: '0.65rem', display: 'block', opacity: 0.7, mt: 0.5, fontStyle: 'italic' }}>
                                    📍 {arg.event.extendedProps.room}
                                </Typography>
                            </Box>
                        )}
                    />
                </div>
            </Paper>
        </Box>
    );
};

export default MySchedule;