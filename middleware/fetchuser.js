const jwt = require("jsonwebtoken");
const JWT_SECRET = "Divyanshuisagoodb$oy";
const fetchmore = (req, res, next) => {
  const token = req.header("authtoken");
  // header se token bhejenge
  if (!token) {
    console.log(token);
    console.log("Access Denied");
    return res.status(401).json({ error: "Access Denied" });
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send("Access Denied");
  }
};
module.exports = fetchmore;