
import express from "express";
import DebtController from "../controllers/debtController.js";

const router = express.Router();

// Get all debts
router.get("/", DebtController.getAllDebts);

// Add new debt
router.post("/", DebtController.addDebt);

// Update debt
router.put("/:id", DebtController.updateDebt);

// Delete debt
router.delete("/delete/:id", DebtController.deleteDebt);

// // Get debt by ID
// router.get("/debt/:id", DebtController.getDebtById);

// // Get total debts
// router.get("/gettotaldebts", DebtController.getTotalDebts);

// // Get debts overview
// router.get("/debtsoverview", DebtController.getDebtsOverview);

export default router;
