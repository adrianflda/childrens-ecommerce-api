import { Router } from 'express';
import AppInfoController from '../../controllers/AppInfoController';

const router = Router();

// Endpoints for info
router.get('/', AppInfoController);

export default router;
