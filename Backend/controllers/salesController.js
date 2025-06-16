import Sales from "../models/Sales.js";
const salesController = {
  getAllSales: async (req, res) => {
    try {
      const sales = await Sales.getAllSales();
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createSale: async (req, res) => {
    try {
      const saleId = await Sales.createSale(req.body);
      res.status(201).json({ success: true, saleId });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getProductsInSale: async (req, res) => {
    try {
      const { id, saleType } = req.params;
      if (!id || !saleType) {
        return res
          .status(400)
          .json({ error: "Sale ID and Sale Type are required" });
      }

      const products = await Sales.getProductsInSale(id, saleType);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products in sale:", error);
      res.status(500).json({ error: error.message });
    }
  },

  updateSale: async (req, res) => {
    try {
      console.log(req.body);
      await Sales.updateSale(req.params.id, req.body);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteSale: async (req, res) => {
    try {
      await Sales.deleteSale(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
};

export default salesController;
