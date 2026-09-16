const express = require("express");
const Task = require("../models/Task");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get all tasks
router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: error.message
        });
    }
});

// Create a task
router.post("/", protect, async (req, res) => {
    try {
        const {
            title,
            description,
            dueDate,
            priority,
            category
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = await Task.create({
            userId: req.userId,
            title,
            description,
            dueDate,
            priority,
            category
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task",
            error: error.message
        });
    }
});

// Update a task
router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task",
            error: error.message
        });
    }
});

// Delete a task
router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task",
            error: error.message
        });
    }
});

module.exports = router;