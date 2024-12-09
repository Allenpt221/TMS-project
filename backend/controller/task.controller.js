import TaskManagement from "../model/Task.model.js";
import mongoose from "mongoose";

export const createTask = async (req, res) =>{
    const {title, description, dueDate, createBy} = req.body;
    try {
        if(!title || !description){
            return res.status(400).json({success: false, message: 'title and description are required'});
        }
         // Validate dueDate format (MM/DD/YY)
        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(\d{2})$/;
        if (!dueDate || !datePattern.test(dueDate)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Please use MM/DD/YY.' });
        }
        const [month, day, year] = dueDate.split('/');
        const formattedDate = new Date(`20${year}-${month}-${day}`);
        
        const existTitle = await TaskManagement.findOne({title});
        if(existTitle){
            return res.status(400).json({success: false, message: 'Title already exist'});
        }

        const newTask = new TaskManagement({title, description, dueDate: formattedDate, createBy});
        await newTask.save();

        res.status(200).json({success: true, message: 'Task successfully create'});
    } catch(error){
        console.error('error server:' , error.message);
        res.status(500).json({success: false, message: 'Server is Error'});
    }
};

export const deletetask = async (req, res) =>{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'ID Not Found'});
    }
    try {
        await TaskManagement.findByIdAndDelete(id);

        return res.status(200).json({success: true, message: 'Task successfully Delete'});
    } catch (error){
        console.error("Server Error", error.message);
        return res.status(500).json({success: false, message: 'Error is server'});
    }
};

export const updatetask = async (req, res) =>{
    const { id } = req.params;
    const {title, description, dueDate, createBy} = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: 'ID Not Found'});
    }

    try {
        const task = await TaskManagement.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(\d{2})$/;
        if (!dueDate || !datePattern.test(dueDate)) {
            return res.status(400).json({ success: false, message: 'Invalid date format. Please use MM/DD/YY.' });
        }

        const [month, day, year] = dueDate.split('/');
        const formattedDate = new Date(`20${year}-${month}-${day}`);

        const updatedTask = await TaskManagement.findByIdAndUpdate(id, {title, description, dueDate: formattedDate, createBy}, {new: true});
        return res.status(200).json({success: true, data: updatedTask});
    } catch(error){
        console.error("Server Error", error.message);
        return res.status(500).json({success: false, message: 'Error is server'});
    }
};


export const showtask = async (req, res) => {
    try {
        const task = await TaskManagement.find({});
        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }
        return res.status(200).json({success: true, data: task});
    } catch (error){
        console.error("Server Error", error.message);
        return res.status(500).json({success: false, message: 'Error is server'});
    }
};

export const showtaskById = async (req, res) =>{
    const { id } = req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, messsage: 'Invalid ID'});
    }
    try {
        const showtaskId = await TaskManagement.findById(id);
        
        
        return res.status(200).json({success: true, data: showtaskId});
    } catch (error){
        console.error("Server Error", error.message);
        return res.status(500).json({success: false, message: 'Error is server'});
    }
};

