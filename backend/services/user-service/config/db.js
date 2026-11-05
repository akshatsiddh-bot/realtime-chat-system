import mongoose from "mongoose";
import logger from "./logger.js"

const connectDB =async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)

        logger.info(`MongoDB Connected: ${conn.connection.host}`);

    }catch(err){
        logger.error( 'Database connection failed',err);

        return res.status(500).json({
            message:"Database connection failed",
            status:false,
            error:err.message
        })
    }
}

export default connectDB;