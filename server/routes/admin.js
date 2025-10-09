const router = require('express').Router();
const Course = require('../models/Course');
const User = require('../models/User');

router.get('/stats', async (req, res) => {
    try {
        const totalCourses = await Course.countDocuments();

        
        const enrollmentData = await Course.aggregate([
            { $project: { enrollmentCount: { $size: "$enrolledStudents" } } },
            { $group: { _id: null, totalEnrollments: { $sum: "$enrollmentCount" } } }
        ]);
        const totalEnrollments = enrollmentData.length > 0 ? enrollmentData[0].totalEnrollments : 0;

        
        const scheduleConflicts = 0; 

        const avgEnrollment = totalCourses > 0 ? (totalEnrollments / totalCourses).toFixed(1) : 0;

        res.json({
            totalCourses,
            totalEnrollments,
            avgEnrollment,
            scheduleConflicts
        });
    } catch (err) {
        res.status(500).json('Error: ' + err.message);
    }
});
router.get('/registrations', async (req, res) => {
    try {
        
        const coursesWithStudents = await Course.find({ 'enrolledStudents.0': { $exists: true } })
            .populate('enrolledStudents', 'username');

        
        const registrations = coursesWithStudents.flatMap(course =>
            course.enrolledStudents.map(student => ({
                id: `${course._id}-${student._id}`,
                studentName: student.username,
                courseCode: course.courseCode,
                courseTitle: course.title,
                status: 'enrolled'
            }))
        );

        res.json(registrations);
    } catch (err) {
        res.status(500).json('Error: ' + err.message);
    }
});

module.exports = router;