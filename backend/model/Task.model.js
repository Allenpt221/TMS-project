import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        unique: true,
    },
    description: {
        type: String,
        require: true
    },
    dueDate: {
        type: String,
        require: true
    },
    createBy: {
        type: String, 
        require: true
    },
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;