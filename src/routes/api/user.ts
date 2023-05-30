import { Router } from 'express';
import { getUserController, updateUserRolesController } from '../../controllers/user';
import allowRole from '../../middleware/allowRole';

const router = Router();

router.get('/', getUserController);
router.put('/:userId/role', allowRole(['admin']), updateUserRolesController);

export default router;
