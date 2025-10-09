const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
    courseCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    instructor: { type: String, required: true },
    credits: { type: Number, required: true },
    department: { type: String, required: true },
    room: { type: String, required: true },
    schedule: [{
        day: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        courseType: { type: String, enum: ['lecture', 'lab', 'tutorial'], default: 'lecture' }
    }],
    capacity: { type: Number, required: true },
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', courseSchema);