import { Router } from 'express';
import { createSaleOrderController, getSaleOrderListController, getSalesController } from '../../controllers/saleOrder';

const router = Router();

router.get('/', getSaleOrderListController);
router.get('/sales', getSalesController);
router.post('/', createSaleOrderController);

export default router;
