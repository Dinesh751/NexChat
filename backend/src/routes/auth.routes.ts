import express from 'express';
import { registerUser, loginUser, refreshToken, logoutUser } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/authCheck.middleware';

const router = express.Router();



router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh-token', refreshToken);
router.post('/logout', logoutUser);


export default router;
