import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeAccess,
  deleteEmployee,
  deactivateEmployee,
  activateEmployee,
  getEmployeeAccess,
  signedUser,
  updateEmployeePhoto,
  updateUserProfile,
} from "../controllers/employeeController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", getAllEmployees);
// router.get("/:id", getEmployeeById);
router.get("/employeeAccess/:id", getEmployeeAccess);
router.get("/signedUser", signedUser);
router.post("/addEmployee", addEmployee);
router.post("/updateAccess", updateEmployeeAccess);
router.post("/delete", deleteEmployee);
router.post("/deactivate", deactivateEmployee);
router.post("/activate", activateEmployee);
router.post("/updateuserphoto", upload.single("photo"), updateEmployeePhoto);
router.post("/updateUserProfile", updateUserProfile);

export default router;