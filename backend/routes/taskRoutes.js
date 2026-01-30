const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const taskController = require("../controllers/taskController");

router.use(authMiddleware); // protect all routes
router.post("/", taskController.createTask);
router.get("/", taskController.getTasks);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
module.exports = router;