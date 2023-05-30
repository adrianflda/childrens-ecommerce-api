import { Router } from 'express';
import {
  getProductController,
  getProductListController,
  createProductController,
  updateProductController,
  updateProductVoteController,
  removeProductController,
  populateProductsController
} from '../../controllers/product';
import allowRole from '../../middleware/allowRole';
import { paginate } from '../../utils';

const router = Router();

router.get('/list', paginate(10, 5, 100), getProductListController);
router.get('/:productId', getProductController);
router.post('/', allowRole(['admin']), createProductController);
router.put('/:productId', allowRole(['admin']), updateProductController);
router.patch('/:productId/vote', updateProductVoteController);
router.delete('/:productId', allowRole(['admin']), removeProductController);

router.post('/populate', allowRole(['admin']), populateProductsController);
export default router;
