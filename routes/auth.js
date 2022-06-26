const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "Divyanshuisagoodb$oy";
const fetchuser=require("../middleware/fetchuser") 
let success=false;
//secret signature.
//json webtoken tab use hoga jab user ne login karliya ho aur ab hame server se koi credential info provide karni ho to user dubara login kare to user experience kharab hoga to use ham ek authentication token provide kardete hai
// secure communication establish karwayga jwt
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // async function bana diya errors mai error aa jaynge validation check hoke
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
      // 400 is status for bad request which will be send in this if errrors array is not empty
    }
    try {
      // to avoid any chances of app getting crashed we have make a try and catch block just to be safe.
      let email = req.body.email;
      let user = await User.findOne({ email: email });
      // this will check if the user exist in the database or not
      if (user) {
        return res
          .status(400)
          .json({ errors: "Sorry this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const securepass = await bcrypt.hash(req.body.password, salt);
      // console.log(user);
      let user2 = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: securepass,
      });
      // user ko create karega aur wait karega jab tak create nahi hota.
      const data = {
        user: { id: user2.id },
        // user id set kardi because id se retrival is fastest ye hi ham use karenge authentication mai.
      };
      const jwtData = jwt.sign(data, JWT_SECRET);
      console.log(jwtData);
      res.status(200).json(user2);
    } catch (error) {
      res.status(400).json("internal servor error");
      console.log(error);
    }
    // user bana liya
    // user.save() se database par save ho jaayga data.
  }
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 8 })],
  async (req, res) => {
    const errors = validationResult(req);
    // ye ek array return karega errors ki
    if (!errors.isEmpty()) {
      console.log("errors");
      return res.status(404).send("Please Enter Valid Credentials");
    }
    let email = req.body.email;
    let user = await User.findOne({ email: email });
    if (!user) {
      console.log(user);
      return res.status(400).json({success,error:"Invalid credentials"});
    }
    let password = req.body.password;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      console.log(password);
      return res.status(400).json({success,error:"Invalid credentials"});
    }
    const data = {
      user: { id: user.id },
      // user id set kardi because id se retrival is fastest ye hi ham use karenge authentication mai.
    };
    const jwtData = jwt.sign(data, JWT_SECRET);
    console.log(jwtData);
    success=true;
    res.status(200).json({success,jwtData});
  }
);
router.post("/getuser", fetchuser,async (req, res) => {
  try {
    let userid=req.user.id;
    let user = await User.findById(userid).select("-password");
    console.log(user);
    res.send(user);
  } catch (error) {
    res.status(400).json("internal servor error");
    console.log(error);
  }
});
module.exports = router;
// asdfrweq
