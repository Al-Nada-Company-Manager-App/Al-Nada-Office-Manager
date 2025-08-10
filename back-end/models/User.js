import prisma from "../config/db.js";
import bcrypt from "bcrypt";

class User {
  static async findByUsername(username) {
    return await prisma.employee.findUnique({
      where: { e_username: username },
    });
  }

  static async updatePassword(username, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.employee.update({
      where: { e_username: username },
      data: { e_password: hashedPassword },
    });
  }

  static async deactivateUser(username) {
    await prisma.employee.update({
      where: { e_username: username },
      data: { e_active: false },
    });
  }
}

export default User;
