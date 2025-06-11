import express from "express";
import employeeController from "../controllers/employeeController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", employeeController.getAllEmployees);
// router.get("/:id", employeeController.getEmployeeById);
router.get("/employeeAccess/:id", employeeController.getEmployeeAccess);
router.get("/signedUser", employeeController.signedUser);
router.post("/addEmployee", employeeController.addEmployee);
router.post("/updateAccess", employeeController.updateEmployeeAccess);
router.delete("/delete/:id", employeeController.deleteEmployee);
router.put("/deactivate/:id", employeeController.deactivateEmployee);
router.put("/activate/:id", employeeController.activateEmployee);
router.post("/updateuserphoto", upload.single("photo"), employeeController.updateEmployeePhoto);
router.post("/updateUserProfile", employeeController.updateUserProfile);

export default router;