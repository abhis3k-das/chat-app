import express from 'express';
import { protectedRoute } from '../middlewares/auth.middleware.js';
import { getMessages, getUsersForSideBar, sendMessages } from '../controllers/message.controller.js';

const router = express.Router();


router.get('/users', protectedRoute, getUsersForSideBar);

router.get('/:id', protectedRoute, getMessages);

router.post('/send/:id', protectedRoute, sendMessages)

export default router;