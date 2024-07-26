const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    _v: {
        type: Number,
      },
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    createdAt: Date,
    updatedAt: Date,
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
      },// Reference to the user
  },
  { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
