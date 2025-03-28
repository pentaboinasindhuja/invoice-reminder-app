require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const axios = require("axios");
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:3001", credentials: true }));
app.use(passport.initialize());

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing! Set it in .env file.");
    process.exit(1);
}

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => done(null, profile)));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // Google OAuth Callback
    app.get('/auth/google/callback',
        passport.authenticate('google', { session: false }),
        (req, res) => {
            if (!req.user) {
                console.log("Authentication failed");
                return res.status(401).json({ error: "Authentication failed" });
            }

            // Include user details in JWT
            const token = jwt.sign(
                {
                    id: req.user.id,
                    name: req.user.displayName,
                    email: req.user.emails[0].value,
                    picture: req.user.photos[0].value
                },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );
            res.redirect(`http://localhost:3001/invoices?token=${token}`);
        }
    );

    // API to get user details
    app.get("/me", (req, res) => {    
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Return user details
            res.json({
                name: decoded.name || "Unknown User",
                email: decoded.email || "No email",
                picture: decoded.picture || ""
            });
        } catch (err) {
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ error: "Invalid token" });
        }
    });

    // API to get due invoices list
    app.get('/invoices', (req, res) => {
        res.json([
            { id: 1001, amount: 100.00, dueDate: "2025-04-01", recipient: "John Doe" ,status:"Due" },
            { id: 1002, amount: 250.75, dueDate: "2025-04-05", recipient: "Jane Smith" ,status:"Due" },
            { id: 1003, amount: 500.25, dueDate: "2025-03-27", recipient: "Alice Johnson" ,status:"Over Due" },
            { id: 1004, amount: 750.50, dueDate: "2025-03-30", recipient: "Bob Brown" ,status:"Due" },
            { id: 1005, amount: 300.00, dueDate: "2025-04-10", recipient: "Charlie Davis" ,status:"Due" }
        ]);
    });
    
    // API to send invoice remainder email
    app.post("/send-invoice-reminder", (req, res) => {
        const { invoiceId, recipient, amount, dueDate, status } = req.body;

        if (!invoiceId || !recipient || !amount || !dueDate) {
            return res.status(400).json({ success: false, message: "Missing invoice details." });
        }
    
        const payload = {
            invoiceId,
            recipient,
            amount,
            dueDate,
            status
        };
        console.log("Request payload:", payload); 

        // Send data to Zapier webhook
        axios.post(process.env.ZAPIER_WEBHOOK_URL, payload, {
            headers: { "Content-Type": "application/json" }
        })
        .then(() => {
            res.json({ success: true, message: "Invoice Reminder sent!" });
        })
        .catch(error => {
            console.error("Error sending invoice reminder:", error.response?.data || error.message);
            res.status(500).json({ success: false, message: "Failed to send Invoice Reminder" });
        });

    });

    app.listen(5000, () => console.log("Backend running on port 5000"));