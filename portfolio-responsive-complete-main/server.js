const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer'); // Import nodemailer

// Initialize express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for cross-origin requests

// Serve static files (your HTML, CSS, and JS files)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/')
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

// Nodemailer setup for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use any email service
    auth: {
        user: 'amarkp204@gmail.com', // Your email
        pass: 'yobe ykhk fshr gnqe', // Your email password (or app-specific password)
    }
});

// API route for contact form submission
app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate incoming data
    if (!name || !email || !message) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    try {
        // Save the message to the database
        const newMessage = new Message({ name, email, message });
        await newMessage.save();
        console.log('New message saved:', newMessage); // Log saved message

        // Send an email notification
        const mailOptions = {
            from: 'amarkp204@gmail.com',
            to: 'amarkp108@gmail.com', // Email to send the notification to
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ msg: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ msg: 'Message sent and email notification delivered' });
            }
        });

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
