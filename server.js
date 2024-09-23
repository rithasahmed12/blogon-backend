import express  from "express";
import dotenv from 'dotenv'
import cors from 'cors';
dotenv.config();

import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import connectDB from "./config/db.js";

import router from "./routes/route.js";

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/api',router);

app.use(notFound)
app.use(errorHandler)

app.listen(port,()=>{
    console.log(`Server started on port ${port}`);
})