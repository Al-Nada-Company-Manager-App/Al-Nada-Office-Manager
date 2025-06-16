import express from "express";
import employeeController from "../controllers/employeeController.js";
import upload from "../controllers/middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", employeeController.getAllEmployees);
// router.get("/:id", employeeController.getEmployeeById);
router.get("/employeeAccess/:id", employeeController.getEmployeeAccess);
router.get("/signedUser", employeeController.signedUser);
router.post("/addEmployee", employeeController.addEmployee);
router.put("/updateAccess", employeeController.updateEmployeeAccess);
router.delete("/delete/:id", employeeController.deleteEmployee);
router.patch("/deactivate/:id", employeeController.deactivateEmployee);
router.patch("/activate/:id", employeeController.activateEmployee);
router.patch(
  "/updateuserphoto",
  upload.single("photo"),
  employeeController.updateEmployeePhoto
);
router.put("/updateUserProfile", employeeController.updateUserProfile);

export default router;
