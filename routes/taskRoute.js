const express = require('express');
const {   listTask,createTask,updateTask,getTaskById,deleteTask } = require('../controllers/taskController');
const { authenticateUser } = require('../middleware/authenticationMiddleware');
const router = express.Router();

router.post('/createTask',authenticateUser(['admin','user']), createTask);
router.put('/updateTask/:id',authenticateUser(['admin']), updateTask);
router.get('/listTask',authenticateUser(['admin','user']), listTask);
router.get('/getTaskById/:id',authenticateUser(['admin','user']), getTaskById);
router.delete('/deleteTask/:id',authenticateUser(['admin']), deleteTask);

module.exports = router;
