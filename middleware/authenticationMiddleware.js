const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserLoginLog = require('../models/UserLoginLogModel')

dotenv.config();

const authenticateUser = (allowedRoles = []) => {
  if (typeof allowedRoles === 'string') {
    allowedRoles = [allowedRoles];
  }

  return async(req, res, next) => {
    try {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized. Token missing.' });
      }

      const token = authHeader.replace('Bearer ', '');
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      let userData = await UserLoginLog.findOne()
      .where('accessToken').equals(token)
      .where('user').equals(decodedToken.userId);

      if(!userData){
        console.log("here");
        return res.status(401).json({ message: 'Unauthorized. Invalid token.' });
      }
      req.user = decodedToken;

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(401).json({ message: 'Forbidden. Insufficient permissions.' });
      }

      next();
    } catch (error) {
        console.log(error);
      res.status(401).json({ message: 'Unauthorized. Invalid token.' });
    }
  };
};

module.exports = { authenticateUser };
