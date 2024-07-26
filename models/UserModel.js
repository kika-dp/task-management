const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  _v: {
    type: Number,
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    trim: true,
  },
  mobileNumber: {
    type: String,
    minLength: 10,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true
})

const User = mongoose.model('user', userSchema)

module.exports = User