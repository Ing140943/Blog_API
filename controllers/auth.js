import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // CHECK EXISTING USER
    const select_q = `SELECT * FROM users WHERE email = $1 OR username = $2`;
    const selectResult = await db.query(select_q, [req.body.email, req.body.username]);

    if (selectResult.rowCount > 0) {
      return res.status(409).json("User already exists!");
    }

    // ENCRYPT user password by bcryptjs module
    // Hash the password and create user (read from bcryptjs doc)
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insert_q = `INSERT INTO users("username", "email", "password") VALUES ($1, $2, $3)`;
    const values = [req.body.username, req.body.email, hash];
    const insertResult = await db.query(insert_q, values);

    return res.status(200).json("User has been created.");
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json("Internal server error: register");
  }
};

export const login = async (req, res) => {
  try {
    // CHECK USER
    const select_q = `SELECT * FROM users WHERE username = $1`;
    const selectResult = await db.query(select_q, [req.body.username]);

    if (selectResult.rowCount === 0) {
      return res.status(404).json("User not found!");
    }

    const user = selectResult.rows[0];

    // Check password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);
    const { password, ...other } = user;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(other);
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json("Internal server error: login");
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  }).status(200).json("User has been logged out.");
};
