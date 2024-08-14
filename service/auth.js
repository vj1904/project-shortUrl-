const jwt = require("jsonwebtoken");
const secretKey = "Vaibhav@123$";

function setUser(user) {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
    },
    secretKey,
    { expiresIn: "300s" }
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    return null;
  }
}

module.exports = {
  getUser,
  setUser,
};
