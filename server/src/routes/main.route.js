const express = require('express');
const mainRouter = express.Router();
const userRouter = require('./users.route');

mainRouter.use('/user', userRouter);

module.exports = mainRouter;