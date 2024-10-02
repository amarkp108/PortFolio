const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Initialize express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Serve static files (your HTML, CSS, and JS files)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb+srv://amarkp108:DpSWM72Yi73U1DgU@user.rsdmh.mongodb.net/User?retryWrites=true&w=majority')
    .then(() => console.log('MongoDB connected to User database'))
    .catch(err => console.log('MongoDB connection error:', err));


// Message schema
const messageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

// Message model for the 'Messages' collection
const Message = mongoose.model('messages', messageSchema);

// API route for contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    try {
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log('New message saved:', newMessage); // Log saved message
        res.status(200).json({ msg: 'Message sent successfully' });
    } catch (error) {
        console.error('Error saving message:', error); // Log error details
        res.status(500).json({ msg: 'Server error' });
    }
});

// Serve index.html as the home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 8000; // Keep the port or change as needed
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
