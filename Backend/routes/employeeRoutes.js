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
router.post("/delete", employeeController.deleteEmployee);
router.post("/deactivate", employeeController.deactivateEmployee);
router.post("/activate", employeeController.activateEmployee);
router.post("/updateuserphoto", upload.single("photo"), employeeController.updateEmployeePhoto);
router.post("/updateUserProfile", employeeController.updateUserProfile);

export default router;