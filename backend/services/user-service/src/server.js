import express from "express"
import dotenv from "dotenv"
import logger from "../config/logger.js"
import morgan from "morgan"

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan('dev'))

const PORT = process.env.PORT || 4001


const startServer = async () =>{
    try {
        // await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        logger.error(error, 'Server startup failed');
        process.exit(1);
    }
};

startServer();