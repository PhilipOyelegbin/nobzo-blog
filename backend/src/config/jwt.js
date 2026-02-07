import jwt from "jsonwebtoken";

function signToken(payload) {
  const secretKey = process.env.JWT_SECRET;
  const options = { expiresIn: "1h" };
  return jwt.sign(payload, secretKey, options);
}

export { signToken };
