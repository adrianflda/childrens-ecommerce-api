import { Router } from 'express';
import {
  getUserController,
  populateUsersController,
  updateUserRolesController
} from '../../controllers/user';
import allowRole from '../../middleware/allowRole';

const router = Router();

router.get('/', getUserController);
router.put('/:userId/role', allowRole(['admin']), updateUserRolesController);

router.post('/populate', allowRole(['admin']), populateUsersController);
export default router;
