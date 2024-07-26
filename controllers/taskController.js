
const Task = require('../models/TaskModel');


const listTask = async (req, res) => {
  try {
    let {
      pageNumber,
      pageRecord
    } = req.query
    const page = parseInt(pageNumber) || 1;
    const limit = parseInt(pageRecord) || 10;

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalTasks = await Task.countDocuments();
    const tasks = await Task.find().skip(startIndex).limit(limit);

    res.status(200).json({
      "is_error": false,
      tasks,
      currentPage: page,
      totalPages: Math.ceil(totalTasks / limit)
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error": true,
      "message": error.message
    })
  }
}
const createTask = async (req, res) => {
  try {
    let {
      title,
      description
    } = req.body
    const task = await Task.create({
      title: title,
      description: description,
      createdAt: new Date(),
      // user: user._id
    })

    res.status(200).json({
      "is_error": false,
      "task": task
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error": true,
      "message": error.message
    })
  }
}
const updateTask = async (req, res) => {
  try {
    let {
      id
    } = req.params
    let {
      title,
      description
    } = req.body
    const task = await Task.findByIdAndUpdate(id, {
      title: title,
      description: description,
      updatedAt: new Date()
    }, {
      new: true
    });
    if (!task) {
      return res.status(404).json({
        "is_error": true,
        "message": 'Task not found'
      });
    }

    res.status(200).json({
      "is_error": false,
      "task": task
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error": true,
      "message": error.message
    })
  }
}
const getTaskById = async (req, res) => {
  try {
    let {
      id
    } = req.params
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        "is_error": true,
        "message": 'Task not found'
      });
    }

    res.status(200).json({
      "is_error": false,
      "task":task
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error": true,
      "message": error.message
    })
  }
}
const deleteTask = async (req, res) => {
  try {
    let {
      id
    } = req.params
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({
        "is_error": true,
        "message": 'Task not found'
      });
    }

    res.status(200).json({
      "is_error": false,
      message:"Task deleted"
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error": true,
      "message": error.message
    })
  }
}

module.exports = {
  listTask,
  createTask,
  updateTask,
  getTaskById,
  deleteTask
}