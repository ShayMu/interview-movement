const express = require('express');
const router = express.Router();
const userController = require('../controllers/users.controller');
const asyncHandler = require('../middlewares/errors.middleware').asyncHandler;

router.get('/getUsers/:page', asyncHandler((req, res, next) => userController.getUsers(req, res, next)));
router.get('/getUser/:id',asyncHandler((req, res, next) => userController.getUser(req, res, next)));
router.post('/createUser',asyncHandler((req, res, next) => userController.createUser(req, res, next)));
router.put('/updateUser/:id',asyncHandler((req, res, next) => userController.updateUser(req, res, next)));
router.delete('/deleteUser/:id',asyncHandler((req, res, next) => userController.deleteUser(req, res, next)));

module.exports = router;