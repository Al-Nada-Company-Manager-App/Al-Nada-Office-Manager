// controllers/authController.js
import passport from "passport";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const changePassword = async (req, res) => {
  const { username, newPassword } = req.body;

  if (!username || !newPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Username and new password are required.",
      });
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(404).json({ message: "Username does not exist." });
    }

    await User.updatePassword(username, newPassword);

    if (user.e_role !== "Manager") {
      await User.deactivateUser(username);
    }

    return res.status(200).json({
      message:
        "Password updated successfully. Wait for reactivation from the manager.",
      E_ID: user.e_id,
      F_NAME: user.f_name,
      L_NAME: user.l_name,
      E_ROLE: user.e_role,
      success: true,
    });
  } catch (err) {
    console.error("Error updating password:", err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server error. Please try again later.",
      });
  }
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
    if (!user) {
      return res.json({ success: false, message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Server error" });
      }
      res.json({
        success: true,
        message: "Login successful",
        user: { id: user.e_id, username: user.e_username },
      });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res
        .status(500)
        .json({ success: false, message: "Could not log out" });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Could not log out" });
      }
      res.clearCookie("connect.sid", { path: "/" });
      res.json({ success: true, message: "Logout successful" });
    });
  });
};

const getSession = (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user });
  } else {
    res.json({ success: false, message: "Not authenticated" });
  }
};

export { changePassword, login, logout, getSession };
