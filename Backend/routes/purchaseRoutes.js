import express from 'express';
import purchaseController from '../controllers/purchaseController.js';

const router = express.Router();

// RESTful routes for purchases
router.get('/', purchaseController.getAllPurchases);
router.get('/:id/products/', purchaseController.getProductsInPurchase);
router.post('/', purchaseController.addPurchase);
router.put('/:id', purchaseController.updatePurchase);
router.delete('/delete/:id', purchaseController.deletePurchase);

export default router;