import express, {Express} from 'express';
import dotenv from 'dotenv';
import router from './router/index'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
);
app.use('/api', router);


const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL_LOCAL);
        app.listen(PORT, () => {
            console.log(`⚡️ Server is running at :${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();


