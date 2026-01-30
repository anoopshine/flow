const Task = require("../models/Task");

exports.createTask = async (req, res) => {

    try {
        const task = await Task.create({
            user: req.user._id,
            title: req.body.title,
            description: req.body.description,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// READ (user-specific)
exports.getTasks = async (req, res) => {
    try {
        // const tasks = await Task.find({ user: req.user._id }).sort("-createdAt");
        // res.json(tasks);
        console.log(req.originalUrl);
        console.log('req.query.page', req.query.page, req.query)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        console.log({ page, limit, skip });

        const filter = { user: req.user._id };

        // Filter by completed
        if (req.query.completed !== undefined) {
            filter.completed = req.query.completed === "true";
        }

        // Search by title
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" };
        }

        const tasks = await Task.find(filter)
            .sort(req.query.sort || "-createdAt")
            .skip(skip)
            .limit(limit);

        const total = await Task.countDocuments(filter);

        res.json({
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
            tasks,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

// DELETE
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });

    }

};