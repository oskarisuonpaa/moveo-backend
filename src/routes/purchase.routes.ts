import Router from 'express';

import { addPurchaseController, getAllPurchasesController, getLatestPurchaseByEmailController, getPurchasesByEmailController } from '@controllers/purchase.controller';
const router = Router();

router.get('/', getAllPurchasesController);

router.post('/', addPurchaseController);

router.get('/email/:email', getPurchasesByEmailController);

router.get('/latest/:email', getLatestPurchaseByEmailController);
export default router;
