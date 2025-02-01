import {
  getAllProducts,
  deleteProduct,
  addProduct,
  updateProduct,
  updateProductPhoto,
} from "../controllers/productController.js";
import upload from "../middleware/uploadMiddleware.js";
import express from "express";

const router = express.Router();
router.get("/", getAllProducts);
router.post("/delete", deleteProduct);
router.post("/AddProduct", addProduct);
router.post("/updateProduct", updateProduct);
router.post("/updatesproductphoto", upload.single("photo"), updateProductPhoto);

export default router;
