import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import cors from 'cors';

// imprt router 
import router from "./routes/auth.route.js"

dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev')); // Log HTTP requests to the console

app.get('/', (req, res) => {
  logger.info('GET request received for home route');
  res.send('Hello World!');
});

// api 
app.use("/api/v1/auth", router)

const PORT = process.env.PORT || 3001;


const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        logger.error(error, 'Server startup failed');
        process.exit(1);
    }
};

startServer();