import express from "express";
import supplierController from "../controllers/supplierController.js";
import upload from "../controllers/middleware/uploadMiddleware.js";

const router = express.Router();

// GET all suppliers
router.get("/", supplierController.getAllSuppliers);

// GET supplier purchases
router.get("/:id/purchases", supplierController.getSupplierPurchases);

// POST create supplier
router.post("/", supplierController.createSupplier);

// PUT update supplier details
router.put("/:id", supplierController.updateSupplier);

// PUT update supplier photo
router.patch(
  "/updatesupplierphoto",
  upload.single("photo"),
  supplierController.updateSupplierPhoto
);

// DELETE supplier
router.delete("/delete/:id", supplierController.deleteSupplier);


export default router;
