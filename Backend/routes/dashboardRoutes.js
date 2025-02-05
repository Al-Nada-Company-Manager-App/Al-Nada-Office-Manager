import express from "express";
import Dashboard from "../models/Dashboard.js";

const router = express.Router();

router.get('/total-stock', Dashboard.getTotalStock);
router.get('/total-purchase', Dashboard.getTotalPurchase);
router.get('/total-sales', Dashboard.getTotalSales);
router.get('/total-debts', Dashboard.getTotalDebts);
router.get('/total-repairs', Dashboard.getTotalRepairs);
router.get('/total-DUM', Dashboard.getTotalDUM);
router.get('/total-spare-parts', Dashboard.getTotalSpareParts);
router.get('/total-pending', Dashboard.getTotalPending);
router.get('/getcustomerscount', Dashboard.getCustomersCount);
router.get('/getsupplierscount', Dashboard.getSuppliersCount);
router.get('/gettopcustomers', Dashboard.getTopCustomers);
router.get('/getproductscount', Dashboard.getProductsCount);
router.get('/gettoprepairedproducts', Dashboard.getTopRepairedProducts);
router.get('/repair-status', Dashboard.getRepairStatus);
router.get('/gettopsoldproducts', Dashboard.getTopSoldProducts);
router.get('/getcustomersales', Dashboard.getCustomerSales);
router.get('/getcustomermarkets', Dashboard.getCustomerMarkets);
router.get('/customersproducts', Dashboard.getCustomersProducts);
router.get('/debtsoverview', Dashboard.getDebtsOverview);
router.get('/purchasesoverview', Dashboard.getPurchasesOverview);
router.get('/repairs-over-time', Dashboard.getRepairsOverTime);
router.get('/salesoverview', Dashboard.getSalesOverview);
router.get('/spare-parts-used', Dashboard.getSparePartsUsed);
router.get('/low-stock-alert', Dashboard.getLowStockAlert);
router.get('/stocks_summary', Dashboard.getStockSummary);
router.get('/suppliersproducts', Dashboard.getSuppliersProducts);
router.get('/topproducts', Dashboard.getTopProducts);

export default router;