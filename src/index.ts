import express, {Express} from 'express';
import path from "path";
import router from './router/index'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from "mongoose";

const config = require('config');

const app: Express = express();
const PORT = config.get('port') || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        credentials: true,
        origin: config.get('baseUrl'),
    })
);
app.use('/api', router);

if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, '..', '..', 'banana-client', 'build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'banana-client', 'build', 'index.html'))
    })
}

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'));
        app.listen(PORT, () => {
            console.log(`⚡️ Server is running at :${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
};

start();


