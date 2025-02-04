import express from 'express';
import supplierController from '../controllers/supplierController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET all suppliers
router.get('/', supplierController.getAllSuppliers);

// POST create supplier
router.post('/', supplierController.createSupplier);

// PUT update supplier photo
router.put('/updatesupplierphoto', upload.single("photo"), supplierController.updateSupplierPhoto);

// PUT update supplier details
router.put('/:id', supplierController.updateSupplier);

// DELETE supplier
router.delete('/:id', supplierController.deleteSupplier);

// GET supplier sales
router.get('/:id/purchases', supplierController.getSupplierPurchases);

export default router;