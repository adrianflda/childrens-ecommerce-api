import { Router } from 'express';
import passport from 'passport';
import { signupController, loginController, logoutController } from '../../controllers/auth';

const router = Router();
const requireAuth = passport.authenticate('jwt');

router.post('/signup', signupController);
router.post('/login', loginController);
router.get('/logout', requireAuth, logoutController);

export default router;
