import express from "express";
import pool from "../db.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create task
router.post("/", verifyToken, async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO tasks (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [req.user.id, title, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task", details: err.message });
  }
});

// Get all tasks for a user
router.get("/", verifyToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id=$1", [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks", details: err.message });
  }
});

// Update a task
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const result = await pool.query(
      "UPDATE tasks SET title=$1, description=$2, completed=$3 WHERE id=$4 AND user_id=$5 RETURNING *",
      [title, description, completed, id, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task", details: err.message });
  }
});

// Delete a task
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tasks WHERE id=$1 AND user_id=$2", [id, req.user.id]);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task", details: err.message });
  }
});

export default router;
