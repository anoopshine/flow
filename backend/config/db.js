const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://anoopshinedezign_db_user:8CcnHRmD7IMuEAie@flow.olbb1bq.mongodb.net/?appName=flow');
        console.log("MongoDB connected ✅");
    } catch (error) {
        console.error("MongoDB connection failed ❌", error);
        process.exit(1);
    }
};

module.exports = connectDB;
