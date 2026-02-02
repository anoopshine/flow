const Category = require("../models/Category");

exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create({
            user: req.user._id,
            name: req.body.name, // ✅ matches schema
        });

        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ (user-specific)
exports.getCategories = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { user: req.user._id };

        // Filter by completed
        if (req.query.completed !== undefined) {
            filter.completed = req.query.completed === "true";
        }

        // Search by title
        if (req.query.search) {
            filter.title = { $regex: req.query.search, $options: "i" };
        }

        const tasks = await Category.find(filter)
            .sort(req.query.sort || "-createdAt")
            .skip(skip)
            .limit(limit);

        const total = await Category.countDocuments(filter);

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
exports.updateCategory = async (req, res) => {
    try {
        const task = await Category.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });

    }
};

// DELETE
exports.deleteCategory = async (req, res) => {
    try {
        const task = await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id,
        });

        if (!task) {
            return res.status(404).json({ message: "Category not found" });
        }

        res.json({ message: "Category deleted" });
    } catch (error) {
        res.status(400).json({ error: error.message });

    }

};