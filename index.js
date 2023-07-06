import express from "express";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import cookieParser from "cookie-parser"
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";

const app = express()
dotenv.config()

app.use(cors({
    credentials: true,
  origin: ["https://anime-setthant-blog-d51535ba59d0.herokuapp.com"],
}));
app.use(express.json())
app.use(cookieParser())

// For uploading in the machine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now()+file.originalname)
    }
})

// const upload = multer({ storage: storage }) //same name

const upload = multer({ storage})

app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file
    res.status(200).json(file.filename)
})

app.get("/", (req, res) => {
    res.json("Hi from backend")
})
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes) 
app.use("/api/posts", postRoutes)


app.listen(process.env.PORT, () => {
    console.log("Connected!")
})