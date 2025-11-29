const router = require('express').Router();
const Course = require('../models/Course');

// GET all courses (NOW FILTERS BY YEAR)
router.get('/', async (req, res) => {
    try {
        const { year } = req.query;
        let filter = {};
        if (year) {
            filter.year = parseInt(year, 10);
        }
        const courses = await Course.find(filter);
        res.json(courses);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});

// GET courses for a specific student
router.get('/my-schedule/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const enrolledCourses = await Course.find({ enrolledStudents: studentId });
        res.json(enrolledCourses);
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});

// --- THIS IS THE MISSING ROUTE TO ADD ---
// POST (Admin): Add new course
router.post('/add', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json('Course added!');
    } catch (err) {
        console.error("Error adding course:", err.message); 
        res.status(400).json('Error: ' + err.message);
    }
});
// --- END OF MISSING ROUTE ---

// POST (Student): Register for a course (NOW WITH CONFLICT DETECTION)
router.post('/register', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const courseToRegister = await Course.findById(courseId);
        if (!courseToRegister) {
            return res.status(404).json('Error: Course not found.');
        }
        const studentCourses = await Course.find({ enrolledStudents: studentId });

        // Conflict Detection Logic
        for (const enrolledCourse of studentCourses) {
            for (const enrolledSlot of enrolledCourse.schedule) {
                for (const newSlot of courseToRegister.schedule) {
                    if (enrolledSlot.day === newSlot.day) {
                        const existingStart = parseInt(enrolledSlot.startTime.replace(':', ''));
                        const existingEnd = parseInt(enrolledSlot.endTime.replace(':', ''));
                        const newStart = parseInt(newSlot.startTime.replace(':', ''));
                        const newEnd = parseInt(newSlot.endTime.replace(':', ''));
                        if (Math.max(existingStart, newStart) < Math.min(existingEnd, newEnd)) {
                            const conflictMessage = `Time conflict detected: ${newSlot.day} ${newSlot.startTime}-${newSlot.endTime} (${courseToRegister.courseCode}) clashes with ${enrolledCourse.courseCode}.`;
                            return res.status(409).json(conflictMessage); // 409 Conflict
                        }
                    }
                }
            }
        }
        courseToRegister.enrolledStudents.push(studentId);
        await courseToRegister.save();
        res.json('Registration successful!');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});

// POST (Student): Drop a course
router.post('/drop', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json('Course not found.');
        }
        course.enrolledStudents.pull(studentId);
        await course.save();
        res.json('Successfully dropped the course!');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});

// DELETE a course by ID (Admin)
router.delete('/:id', async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json('Course not found.');
        }
        res.json('Course deleted successfully.');
    } catch (err) {
        res.status(500).json('Error: ' + err.message);
    }
});

module.exports = router;