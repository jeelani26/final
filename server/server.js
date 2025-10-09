const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// --- IMPORTANT: Add your MongoDB Connection String here ---
const MONGO_URI = "mongodb+srv://jeelanimohammad0_db_user:Jeelani2610@cluster0.lup3ag3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
// Add this with your other app.use() calls
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));