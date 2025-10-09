import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const AdminCourseManager = () => {
    const [course, setCourse] = useState({
        courseCode: '',
        title: '',
        instructor: '',
        credits: 0,
        department: '',
        room: '',
        schedule: [{ day: 'Monday', startTime: '09:00', endTime: '10:00' }], 
        capacity: 30
    });
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (['day', 'startTime', 'endTime'].includes(name)) {
            setCourse(prev => ({ ...prev, schedule: [{ ...prev.schedule[0], [name]: value }] }));
        } else {
            setCourse(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/courses/add`, course);
            alert('Course added successfully!');
            window.location.reload();
        } catch (error) {
            alert(`Failed to add course: ${error.response?.data || 'Server error'}`);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField required fullWidth name="courseCode" label="Course Code" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth name="title" label="Course Title" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth name="instructor" label="Instructor Name" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth name="credits" type="number" label="Credits" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth name="department" label="Department" onChange={handleChange} /></Grid> {/* <-- Add this */}
                <Grid item xs={12} sm={6}><TextField required fullWidth name="room" label="Room Number" onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField required fullWidth name="capacity" type="number" label="Capacity" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth>
                        <InputLabel>Day</InputLabel>
                        <Select name="day" value={course.schedule[0].day} label="Day" onChange={handleChange}>
                            <MenuItem value="Monday">Monday</MenuItem><MenuItem value="Tuesday">Tuesday</MenuItem><MenuItem value="Wednesday">Wednesday</MenuItem><MenuItem value="Thursday">Thursday</MenuItem><MenuItem value="Friday">Friday</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}><TextField required fullWidth name="startTime" type="time" label="Start Time" value={course.schedule[0].startTime} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12} sm={4}><TextField required fullWidth name="endTime" type="time" label="End Time" value={course.schedule[0].endTime} onChange={handleChange} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item xs={12}><Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Add Course</Button></Grid>
            </Grid>
        </Box>
    );
};
export default AdminCourseManager;