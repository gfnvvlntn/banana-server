import express, {Express} from 'express';
import dotenv from 'dotenv';
import router from './router/index'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use('/', router);

app.listen(PORT, () => {
    console.log(`⚡️ Server is running at :${PORT}`);
});
