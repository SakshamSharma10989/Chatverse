import path from "path";
import express from "express"
import dotenv from "dotenv" 
import cookieParser from "cookie-parser"

import authRoutes from "../backend/routes/auth.route.js"
import messageRoutes from "../backend/routes/message.route.js"
import userRoutes from "../backend/routes/user.route.js"
import {app,server} from "../backend/socket/socket.js"

import connectToMongo from "./db/connectToMongoDB.js"

dotenv.config()

const __dirname = path.resolve(); 

const PORT= process.env.PORT||5000



app.use(express.json()) //to parse the incoming requests with JSON payload (from req.body)
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.use("/api/user",userRoutes)

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(5000,()=>{
    connectToMongo();
    console.log(`listening ${PORT}`) // npm run server 
})



