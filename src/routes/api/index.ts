import { Router } from 'express';
import passport from 'passport';
import authRoutes from './auth';
import userRoutes from './user';
import productRoutes from './product';
import saleOrderRoutes from './saleOrder';

const requireAuth = passport.authenticate('jwt');

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', requireAuth, userRoutes);
router.use('/product', requireAuth, productRoutes);
router.use('/saleOrder', requireAuth, saleOrderRoutes);

export default router;
