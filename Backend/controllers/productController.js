import Product from "../models/Product.js";

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await Product.delete(id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const addProduct = async (req, res) => {
  try {
    const productData = {
      PNAME: req.body.productname,
      CATEGORY:
        req.body.category === "Other"
          ? req.body.customCategory
          : req.body.category,
      COSTPRICE: req.body.costprice,
      SELLPRICE: req.body.sellprice,
      QUANTITY: req.body.quantity,
      MODEL_CODE: req.body.modelcode,
      DESCRIPTION: req.body.pdescription,
      EXPIRE_DATE:
        req.body.category === "Chemical" ? req.body.expiredate : null,
    };

    const newProduct = await Product.create(productData);

    res.json({
      success: true,
      message: "Product added successfully!",
      p_id: newProduct.p_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to add Product!" });
  }
};

const updateProduct = async (req, res) => {
  try {
    await Product.update(req.body.P_ID, req.body);
    res.json({ success: true, message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating product");
  }
};
const updateProductPhoto = async (req, res) => {
  try {
    await Product.updatePhoto(
      req.body.P_ID,
      req.file ? req.file.filename : null
    );
    res.json({ success: true, message: "Product photo updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating Product photo");
  }
};

export { 
  getAllProducts, 
  deleteProduct,
  addProduct,
  updateProduct,
  updateProductPhoto
 };
