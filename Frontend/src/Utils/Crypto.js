import bcrypt from "bcryptjs";

export const decryptFunction = async (hashedPassword,password) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log(isMatch);
  return isMatch;
};
