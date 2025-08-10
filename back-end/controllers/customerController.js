import Customer from "../models/Customer.js";

const customerController = {
  getAllCustomers: async (req, res) => {
    try {
      const customers = await Customer.getAll();
      res.json(customers);
    } catch (err) {
      console.error("Get Customers Error:", err);
      res.status(500).json({ error: "Failed to fetch customers" });
    }
  },

  createCustomer: async (req, res) => {
    try {
      const newCustomer = await Customer.create(req.body);
      res.json({
        success: true,
        c_id: newCustomer.c_id,
      });
    } catch (err) {
      console.error("Create Customer Error:", err);
      res.status(500).json({
        success: false,
        message: "Error adding customer",
      });
    }
  },
  updateCustomerPhoto: async (req, res) => {
    try {
      const { C_ID } = req.body; 
      const C_PHOTO = req.file ? req.file.filename : null; 

      await Customer.updatePhoto(C_ID, C_PHOTO);
      res.send("Customer photo updated successfully");
    } catch (err) {
      console.error("Update Photo Error:", err);
      res.status(500).send("Error updating customer photo");
    }
  },

  deleteCustomer: async (req, res) => {
    try {
      await Customer.delete(req.params.id);
      res.send("Customer deleted successfully");
    } catch (err) {
      console.error("Delete Customer Error:", err);
      res.status(500).send("Error deleting customer");
    }
  },

  updateCustomer: async (req, res) => {
    try {
      await Customer.update(req.params.id, req.body);
      res.json({ success: true });
    } catch (err) {
      console.error("Update Customer Error:", err);
      res.status(500).send("Error updating customer");
    }
  },

  getCustomerSales: async (req, res) => {
    try {
      const customerData = await Customer.getWithSales(req.params.id);

      if (!customerData) {
        return res.status(404).send("Customer not found");
      }

      res.json(customerData);
    } catch (err) {
      console.error("Customer Sales Error:", err);
      res.status(500).send("Error fetching customer details");
    }
  },
};

export default customerController;
