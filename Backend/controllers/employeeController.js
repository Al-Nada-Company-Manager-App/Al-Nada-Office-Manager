// controllers/employeeController.js
import Employee from "../models/Employee.js";
import db from "../config/db.js";

const employeeController = {
  signedUser: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      let userAccess;
      try {
        userAccess = await Employee.getAccess(req.user.e_id);
      } catch (dbError) {
        console.error("Database Error in getAccess:", dbError);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ user: req.user, access: userAccess });
    } catch (error) {
      console.error("Error in signedUser controller:", error); 
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getEmployeeAccess: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: "Missing id parameter" });
      }
      const access = await Employee.getAccess(id);
      res.json(access);
    } catch (error) {
      console.error("Error in getEmployeeAccess:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getEmployeeById: async (req, res) => {
    try {
      const { id } = req.params;
      const employee = await Employee.getById(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  addEmployee: async (req, res) => {
    try {
      const { username } = req.body;
      const userExists = await db.query(
        "SELECT * FROM EMPLOYEE WHERE E_USERNAME = $1",
        [username]
      );
      if (userExists.rows.length > 0) {
        return res
          .json({ success: false, message: "Username already in use!" });
      }

      const employeeData = req.body;
      const newEmployee = await Employee.create(employeeData);

      res.json({
        success: true,
        message: "Employee added successfully!",
        newEmployee,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Failed to add employee!" });
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const { id, ...profile } = req.body;
      await Employee.update(id, profile);
      res.json({ success: true, message: "User profile updated successfully" });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateEmployeeAccess: async (req, res) => {
    try {
      const { id, ...access } = req.body;
      const user = await Employee.getById(id);
      if (!user) {
        return res.status(404).json({ message: "Username does not exist." });
      }
      await Employee.updateAccess(id, access);
      res.json({ success: true, message: "User access updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateEmployeePhoto: async (req, res) => {
    const E_PHOTO = req.file ? req.file.filename : null;
    const E_ID = req.body.E_ID;
    try {
      await db.query("UPDATE Employee SET E_PHOTO = $1 WHERE E_ID = $2", [
        E_PHOTO,
        E_ID,
      ]);
      res.send("Employee photo updated successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating Employee photo");
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      await Employee.delete(id);
      res.json({ success: true , message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deactivateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      await Employee.deactivate(id);
      res.json({ success: true , message: "Employee deactivated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  activateEmployee: async (req, res) => {
    try {
      const { id } = req.params;
      await Employee.activate(id);
      res.json({ success: true , message: "Employee activated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },


};

export default employeeController;