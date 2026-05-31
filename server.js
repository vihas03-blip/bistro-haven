const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); // Allows your frontend website to talk to this backend
app.use(express.json()); // Allows the server to read JSON data packets

// 1. Connect directly to your MongoDB Atlas Cloud Database
const MONGO_URI = "mongodb+srv://uththarisenadeera1_db_user:xrHAxUjdZIniujZY@cluster0.yplefwj.mongodb.net/?appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Database connected successfully!"))
    .catch(err => console.error("Database connection failed:", err));

// 2. Define the structural Blueprints (Schemas)
const OrderSchema = new mongoose.Schema({
    customerEmail: String,
    cartItems: Array,
    totalAmount: String,
    createdAt: { type: Date, default: Date.now }
});

const ReservationSchema = new mongoose.Schema({
    guests: Number,
    date: String,
    time: String,
    createdAt: { type: Date, default: Date.now }
});

// Create models based on blueprints
const Order = mongoose.model('Order', OrderSchema);
const Reservation = mongoose.model('Reservation', ReservationSchema);

// 3. API Routes (The doors your frontend knocks on)

// Route to handle incoming checkouts
app.post('/api/checkout', async (req, res) => {
    try {
        const newOrder = new Order({
            customerEmail: req.body.customerEmail,
            cartItems: req.body.cartItems,
            totalAmount: req.body.totalAmount
        });
        
        await newOrder.save(); // Saves the order permanently to the cloud database
        res.status(201).json({ success: true, message: "Order logged successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to handle incoming table bookings
app.post('/api/reserve', async (req, res) => {
    try {
        const newBooking = new Reservation({
            guests: req.body.guests,
            date: req.body.date,
            time: req.body.time
        });
        
        await newBooking.save(); // Saves the reservation permanently to the cloud database
        res.status(201).json({ success: true, message: "Table booked successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==========================================
// NEW FRONTEND SERVING LINES ADDED HERE 👇
// ==========================================
// Serve static frontend files (html, css, js) from the current folder
const path = require('path');
app.use(express.static(__dirname));

// Direct any main browser visits straight to your index.html page
app.get('(.*)', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
// ==========================================

// Start the server engine local link
const PORT = 3000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`));