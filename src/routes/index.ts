import { Router } from 'express';
import infoRoutes from './api/info';
import apiRoutes from './api';
import { API_VERSION } from '../config';

const router = Router();
router.use('/api/info', infoRoutes);
router.use(`/api/${API_VERSION}`, apiRoutes);

export default router;
