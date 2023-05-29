import { Router } from 'express';
import passport from 'passport';
import authRoutes from './auth';
import userRoutes from './user';

const requireAuth = passport.authenticate('jwt');

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', requireAuth, userRoutes);

export default router;
