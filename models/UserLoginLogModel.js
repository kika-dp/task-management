const mongoose = require('mongoose')

// @ts-ignore
const userLoginLogsSchema = mongoose.Schema(
  {
    accessToken: {
      type: String,
      required: false,
      trim: true,
    },
    isLogOut: {
      type: Number,
      required: true,
      enum: [0, 1],
      default: 0
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    },
  },
  { timestamps: true }
)

const UserLoginLog = mongoose.model('userLoginLog', userLoginLogsSchema)

module.exports = UserLoginLog
