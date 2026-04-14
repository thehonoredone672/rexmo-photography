// server.js
require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data and serve your static HTML/CSS files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (Assuming your HTML files are in a folder named 'public'. 
// If they are in the root directory alongside server.js, use express.static(__dirname))
app.use(express.static(__dirname)); 

// Route to handle the form submission
app.post('/submit-enquiry', async (req, res) => {
    // Extract data sent from the HTML form
    const { name, email, phone, eventDate, eventType, location, message } = req.body;

    // Set up Nodemailer transporter (Configure this with your email provider)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Your sending email address
            pass: process.env.EMAIL_PASS  // Your email App Password
        }
    });

    // Structure the email you will receive
    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: 'jesleyfrantin@gmail.com', // Where you want to receive the enquiries
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
        // Send the email
        await transporter.sendMail(mailOptions);
        
        // Show a success alert to the user and reload the page
        res.send(`
            <script>
                alert("Thank you, ${name}! Your enquiry has been sent successfully. We will get back to you soon.");
                window.location.href = "/contact.html";
            </script>
        `);
    } catch (error) {
        console.error("Error sending email:", error);
        
        // Show an error alert if it fails
        res.status(500).send(`
            <script>
                alert("Oops! Something went wrong while sending your enquiry. Please try again or contact us directly via WhatsApp.");
                window.history.back();
            </script>
        `);
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
