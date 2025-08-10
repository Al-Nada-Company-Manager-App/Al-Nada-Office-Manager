import express from 'express';
import salesController from '../controllers/salesController.js';

const router = express.Router();

// RESTful routes
router.get('/', salesController.getAllSales);
router.get('/:id/products/:saleType', salesController.getProductsInSale);
router.post('/', salesController.createSale);
router.put('/:id', salesController.updateSale);
router.delete('/delete/:id', salesController.deleteSale);

export default router;