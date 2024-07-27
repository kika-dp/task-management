
const User = require('../models/UserModel')
const UserLoginLog = require('../models/UserLoginLogModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv').config()

//hashing the password
const securePassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

const signupUser = async (req, res) => {
  try {
    let {firstName ,lastName,email,mobileNumber,role,password } = req.body

    const existingUser = await User.findOne({
      email: email,
    }).lean(true)

    if (existingUser) {
      res.status(404)
      return res.json({
        "is error ": true,
        "message": 'A user with this email address already exists. Please add different email address.'
      })
    } else {
      const newUser = await User.create({
        _v: 1,
        firstName: firstName,
        lastName: lastName,
        email: email.toLowerCase(),
        mobileNumber: mobileNumber,
        role:role,
        password: await securePassword(password),
        isActive: true,
      })
      res.status(200).json(
        {
          "is_error":false,
          "message":"User registered successfully.",
          "user":{
            _v: newUser._v,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role:newUser.role,
            mobileNumber: newUser.mobileNumber,
            isActive: newUser.isActive,
          }
        })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error":true,
      "message":error.message
    })
  }
}

const loginUser = async (req, res) => {
  try {
    let {email ,password } = req.body
    const user = await User.findOne({
      email: email,
    })

    if (!user) {
      return res
        .status(404)
        .json({
          "is_error":true,
          "message":'A user with this email does not exist.'
        })
    }
    const auth = await bcrypt.compare(password, user.password)
    if (!auth) {
      return res.status(400).json({
        "is_error":true,
        "message":`Password is incorrect.`
      })
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET);
    let log = await UserLoginLog.findOneAndUpdate({
      user: user._id
    }, {
      accessToken: token,
      isLogOut: 0,
    }, {
      new: true
    })
    if (!log) {
      await UserLoginLog.create({
        accessToken: token,
        isLogOut: 0,
        user: user._id
      })
    }
    
    res.status(200).json(
      {
        "is_error":false,
        "message":"Logged in successfully.",
        "user":{
          _v: user._v,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role:user.role,
          mobileNumber: user.mobileNumber,
          isActive: user.isActive,
        },
        "token":token
      }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error":true,
      "message":'Trouble logging in user.'
    })
  }
}

const logOutUser = async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userData = await UserLoginLog.findOneAndDelete({ accessToken: token, user: decoded.userId },{
      accessToken:"",
      isLogOut:1
    } )
    res.status(200).json(
      {
        "is_error":false,
        "message":"logged out successfully"
      }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      "is_error":true,
      "message":error.message
    })
  }
}
module.exports = {
  signupUser,
  loginUser,
  logOutUser
}