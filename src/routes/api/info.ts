import { Router } from 'express';
import { getAppInfo } from '../../controllers/info';

const router = Router();

// Endpoints for info
router.get('/', getAppInfo);

export default router;
