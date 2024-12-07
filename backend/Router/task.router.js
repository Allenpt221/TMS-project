import express from 'express';
import { createTask, deletetask, showtask, showtaskById, updatetask } from '../controller/task.controller.js';



const router = express.Router();

router.post("/", createTask);
router.delete("/:id", deletetask);
router.put("/:id", updatetask);
router.get("/:id", showtaskById);
router.get("/", showtask);
export default router;