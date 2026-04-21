require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== MIDDLEWARE ==========
// Parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve images from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files (CSS, JS) from 'src' folder
app.use(express.static(path.join(__dirname, 'src')));

// ========== CLEAN URL ROUTES ==========
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'services.html'));
});

app.get('/gallery', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'gallery.html'));
});

app.get('/poetry', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'poetry.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'contact.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'about.html'));
});

// Redirect root to home
app.get('/', (req, res) => {
    res.redirect('/home');
});

// ========== EMAIL FORM HANDLING ==========
app.post('/submit-enquiry', async (req, res) => {
    const { name, email, phone, eventDate, eventType, location, message } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: 'rexmophotography55@gmail.com',
        subject: `New Photography Enquiry: ${eventType} - ${name}`,
        text: `
You have received a new enquiry from your website!

Details:
-------------------------
Name: ${name}
Email: ${email}
Phone: ${phone}
Event Date: ${eventDate}
Event Type: ${eventType}
Location: ${location}

Message:
${message}
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        
        res.send(`
            <script>
                alert("Thank you, ${name}! Your enquiry has been sent successfully. We will get back to you soon.");
                window.location.href = "/contact";
            </script>
        `);
    } catch (error) {
        console.error("Error sending email:", error);
        
        res.status(500).send(`
            <script>
                alert("Oops! Something went wrong. Please try again or contact us via WhatsApp.");
                window.history.back();
            </script>
        `);
    }
});

// ========== 404 HANDLER ==========
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'src', '404.html'));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Visit: http://localhost:${PORT}/home`);
});
