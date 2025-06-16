import Supplier from "../models/Supplier.js";


const supplierController = {
  getAllSuppliers: async (req, res) => {
    try {
      const suppliers = await Supplier.getAll();
      res.json(suppliers);
    } catch (err) {
      console.error("Get Suppliers Error:", err);
      res.status(500).json({ error: "Failed to fetch suppliers" });
    }
  },

  createSupplier: async (req, res) => {
    try {
      const newSupplier = await Supplier.create(req.body);
      res.json({
        success: true,
        s_id: newSupplier.s_id,
      });
    } catch (err) {
      console.error("Create Supplier Error:", err);
      res.status(500).json({
        success: false,
        message: "Error adding supplier",
      });
    }
  },
  updateSupplierPhoto: async (req, res) => {
    try {
      const { S_ID } = req.body; 
      const S_PHOTO = req.file ? req.file.filename : null; 

      await Supplier.updatePhoto(S_ID, S_PHOTO); 
      res.send("Supplier photo updated successfully");
    } catch (err) {
      console.error("Update Photo Error:", err);
      res.status(500).send("Error updating supplier photo");
    }
  },

  deleteSupplier: async (req, res) => {
    try {
      await Supplier.delete(req.params.id);
      res.send("Supplier deleted successfully");
    } catch (err) {
      console.error("Delete Supplier Error:", err);
      res.status(500).send("Error deleting supplier");
    }
  },

  updateSupplier: async (req, res) => {
    try {
      await Supplier.update(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      console.error("Update Supplier Error:", err);
      res.status(500).send("Error updating supplier");
    }
  },

  getSupplierPurchases: async (req, res) => {
    try {
      const supplierData = await Supplier.getWithPurchases(req.params.id);

      if (!supplierData) {
        return res.status(404).send("Supplier not found");
      }

      res.json(supplierData);
    } catch (err) {
      console.error("Supplier Sales Error:", err);
      res.status(500).send("Error fetching supplier details");
    }
  },
};

export default supplierController;
