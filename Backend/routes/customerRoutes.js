import express from 'express';
import customerController from '../controllers/customerController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// GET all customers
router.get('/', customerController.getAllCustomers);

// POST create customer
router.post('/', customerController.createCustomer);

// PUT update customer photo
router.put('/updatecustomerphoto', upload.single("photo"), customerController.updateCustomerPhoto);

// PUT update customer details
router.put('/:id', customerController.updateCustomer);

// DELETE customer
router.delete('/:id', customerController.deleteCustomer);

// GET customer sales
router.get('/:id/sales', customerController.getCustomerSales);

export default router;