import Debt from "../models/Debt.js";

class DebtController {
  // Get all debts
  static async getAllDebts(req, res) {
    try {
      const debts = await Debt.getAllDebts();
      res.json(debts);
    } catch (error) {
      console.error("Error fetching debts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch debts",
        error: error.message,
      });
    }
  }

  // Add new debt
  static async addDebt(req, res) {
    try {
      const debtData = req.body;
      const newDebt = await Debt.addDebt(debtData);
      res.json({
        success: true,
        message: "Debt added successfully!",
        debt: newDebt,
      });
    } catch (error) {
      console.error("Error adding debt:", error);
      res.status(500).json({
        success: false,
        message: "Failed to add Debt!",
        error: error.message,
      });
    }
  }

  // Update debt
  static async updateDebt(req, res) {
    try {
      const { id } = req.params;
      const debtData = req.body;
      await Debt.updateDebt(id, debtData);
      res.json({
        success: true,
        message: "Debt and sale updated successfully!",
      });
    } catch (error) {
      console.error("Error updating debt:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update debt",
        error: error.message,
      });
    }
  }

  // Delete debt
  static async deleteDebt(req, res) {
    try {
      const debtId = req.params.id;
      await Debt.deleteDebt(debtId);
      res.json({
        success: true,
        message: "Debt deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting debt:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting debt",
        error: error.message,
      });
    }
  }

  // Get debt by ID
  static async getDebtById(req, res) {
    try {
      const { id } = req.params;
      const debt = await Debt.getDebtById(id);
      if (!debt) {
        return res.status(404).json({
          success: false,
          message: "Debt not found",
        });
      }
      res.json(debt);
    } catch (error) {
      console.error("Error fetching debt:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch debt",
        error: error.message,
      });
    }
  }

  // Get total debts
  static async getTotalDebts(req, res) {
    try {
      const total = await Debt.getTotalDebts();
      res.json(total);
    } catch (error) {
      console.error("Error fetching total debts:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total debts",
        error: error.message,
      });
    }
  }

  // Get debts overview
  static async getDebtsOverview(req, res) {
    try {
      const overview = await Debt.getDebtsOverview();
      res.json({
        success: true,
        data: overview,
        message: "Debts by type retrieved successfully.",
      });
    } catch (error) {
      console.error("Error fetching debts overview:", error);
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
}

export default DebtController;