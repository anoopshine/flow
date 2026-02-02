require('dotenv').config({ path: './.env' });
const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");
const app = express();
// ✅ CORS FIRST
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

// middleware to parse JSON
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "TaskFlow API running 🚀" });
});


console.log('Environment variables loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('PORT:', process.env.PORT);


// connect database
connectDB();

const PORT = process.env.PORT || 4000;
console.log(process.env.JWT_SECRET, 'hhh', PORT);

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/api/test", (req, res) => {
    res.json({ status: "OK", time: new Date() });
})

app.post("/api/test/post", (req, res) => {
    console.log(req.body);

    res.json({
        success: true,
        data: req.body,
    });
})

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);