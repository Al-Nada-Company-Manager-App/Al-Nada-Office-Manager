import Purchase from "../models/Purchase.js";

const purchaseController = {
  getAllPurchases: async (req, res) => {
    try {
      const purchases = await Purchase.getAllPurchases();
      res.json(purchases);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductsInPurchase: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Purchase ID is required" });
      }
      const products = await Purchase.getProductsInPurchase(id);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products in purchase:", error);
      res.status(500).json({ error: error.message });
    }
  },

  addPurchase: async (req, res) => {
    try {
      const purchaseId = await Purchase.createPurchase(req.body);
      res.status(201).json({ success: true, purchaseId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updatePurchase: async (req, res) => {
    try {
      await Purchase.updatePurchase(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deletePurchase: async (req, res) => {
    try {
      await Purchase.deletePurchase(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default purchaseController;