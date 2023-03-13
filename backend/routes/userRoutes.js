import express from "express";
const userRouter = express.Router();
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { generateToken } from "../utils.js";
import expressAsynchHandler from "express-async-handler";

userRouter.post(
  "/signin",
  expressAsynchHandler(async (req, res) => {
    // by using expressAsynchHandler we can catch the error inside the asynch function
    // if we have error in this function we can handle  it in server.
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Invalid Email or Password" });
  })
);
export default userRouter;
