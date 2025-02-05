import express from 'express';
import salesController from '../controllers/salesController.js';

const router = express.Router();

// RESTful routes
router.get('/', salesController.getAllSales);
router.post('/', salesController.createSale);
router.get('/:id/products/:saleType', salesController.getProductsInSale);
router.put('/:id', salesController.updateSale);
router.delete('/:id', salesController.deleteSale);

export default router;