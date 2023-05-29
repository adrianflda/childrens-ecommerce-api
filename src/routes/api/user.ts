import { Router } from 'express';
import { userRoleUpdateController } from '../../controllers/user';
import allowRole from '../../middleware/allowRole';

const router = Router();

router.put('/:userId/role', allowRole(['admin']), userRoleUpdateController);

export default router;
