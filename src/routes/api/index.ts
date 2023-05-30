import { Router } from 'express';
import passport from 'passport';
import authRoutes from './auth';
import userRoutes from './user';
import productRoutes from './product';

const requireAuth = passport.authenticate('jwt');

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', requireAuth, userRoutes);
router.use('/product', requireAuth, productRoutes);

export default router;
