import express from "express";
import customerController from "../controllers/customerController.js";
import upload from "../controllers/middleware/uploadMiddleware.js";

const router = express.Router();

// GET all customers
router.get("/", customerController.getAllCustomers);

// GET customer sales
router.get("/:id/sales", customerController.getCustomerSales);

// POST create customer
router.post("/", customerController.createCustomer);

// PUT update customer details
router.put("/:id", customerController.updateCustomer);

// PUT update customer photo
router.patch(
    "/updatecustomerphoto",
    upload.single("photo"),
    customerController.updateCustomerPhoto
);    

// DELETE customer
router.delete("/delete/:id", customerController.deleteCustomer);


export default router;
