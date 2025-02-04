import productController from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/", productController.getAllProducts);
router.post("/delete", productController.deleteProduct);
router.post("/AddProduct", productController.addProduct);
router.post("/updateProduct", productController.updateProduct);
router.post("/updatesproductphoto", upload.single("photo"), productController.updateProductPhoto);

export default router;
