const router = require('express').Router();
const Course = require('../models/Course');

// GET all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) { res.status(400).json('Error: ' + err); }
});

// POST (Admin): Add new course
router.post('/add', async (req, res) => {
    try {
        // This creates a new course document from the entire form body
        const newCourse = new Course(req.body); 
        await newCourse.save();
        res.status(201).json('Course added!');
    } catch (err) {
        // If there's an error, log it to the backend terminal
        console.error("Error adding course:", err); 
        res.status(400).json('Error: ' + err.message);
    }
});

// POST (Student): Register for a course with conflict check
router.post('/register', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const courseToRegister = await Course.findById(courseId).lean();
        const studentCourses = await Course.find({ enrolledStudents: studentId }).lean();

        // --- Conflict Detection Logic ---
        for (const enrolledCourse of studentCourses) {
            for (const enrolledSlot of enrolledCourse.schedule) {
                for (const newSlot of courseToRegister.schedule) {
                    if (enrolledSlot.day === newSlot.day) {
                        const existingStart = parseInt(enrolledSlot.startTime.replace(':', ''));
                        const existingEnd = parseInt(enrolledSlot.endTime.replace(':', ''));
                        const newStart = parseInt(newSlot.startTime.replace(':', ''));
                        const newEnd = parseInt(newSlot.endTime.replace(':', ''));

                        // Check for time overlap
                        if (Math.max(existingStart, newStart) < Math.min(existingEnd, newEnd)) {
                            // Conflict found! Return a specific error.
                            return res.status(409).json(`Time conflict between ${enrolledCourse.courseCode} and ${courseToRegister.courseCode} on ${newSlot.day}.`);
                        }
                    }
                }
            }
        }

        // If no conflict, proceed with registration
        await Course.updateOne({ _id: courseId }, { $addToSet: { enrolledStudents: studentId } });
        res.json('Registration successful!');

    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});

// GET courses for a specific student (PASTED IN THE CORRECT PLACE)
router.get('/my-schedule/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const enrolledCourses = await Course.find({ enrolledStudents: studentId });
        res.json(enrolledCourses);
    } catch (err) {
        res.status(400).json('Error: ' + err);
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

        // Remove the studentId from the enrolledStudents array
        course.enrolledStudents.pull(studentId);
        await course.save();

        res.json('Successfully dropped the course!');
    } catch (err) {
        res.status(400).json('Error: ' + err.message);
    }
});
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