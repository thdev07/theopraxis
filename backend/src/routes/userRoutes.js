import express from 'express';
import * as userController from '../controller/userController.js';

export const userRouter = express.Router();

userRouter.get('/pacientes', userController.fetchAll);
userRouter.post('/pacientes', userController.create);