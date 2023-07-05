import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // CHECK EXISTING USER
  const q = `SELECT * FROM users WHERE email = $1 OR username = $2`;
  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) {
      return res.json(err);
    }
    if (data.length) {
      return res.status(409).json("User already exists!");
    }
    //ENCRYPT user password by bcyrptjs module
    //Hash the password and create user (read from bcryptjs doc)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const q = `INSERT INTO users("username", "email", "password") VALUES ($1, $2, $3)`;
    const values = [req.body.username, req.body.email, hash];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(403).json(err);
      console.log("Reach here or not");
      return res.status(200).json("User has been created.");
    });
  });
};

export const login = (req, res) => {
  //CHECK USER

  const q = `SELECT * FROM users WHERE username = $1`;
  db.query(q, [req.body.username], (err, data) => {
    if (err) return json(err);
    // If no any users
    if (data.length == 0) return res.status(404).json("User not found!");

    //Check password (the data is array so the first element is our user)
    console.log(data);
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!isPasswordCorrect)
      return res.status(400).json("Wrong username or password");

    const token = jwt.sign(
      { id: data[0].id },
      process.env.JWT_KEY
    );
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true
  }).status(200).json("User has been logged out.")
};
