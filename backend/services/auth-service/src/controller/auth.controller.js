import AuthUser from "../models/auth-user.model.js";
import argon from "argon2";
import logger from "../config/logger.js";

// signup 
export const signup = async (req,res)=>{
    try{
        const {name,email,password} = req.body;

        // check if any user alreay exists with the same email
        const exists = await AuthUser.findOne({email})
        if (exists){
            logger.info(`User already exists with the same email: ${email}`)
            return res.status(400).json({
                message:"User already exists with the same email",
            })
        }

        // hash pwd 
        const hashedPassword = await argon.hash(password)

        // create new user 
        const newUser = new AuthUser({
            name,
            email,
            password : hashedPassword
        })

        await newUser.save()
        logger.info(`User created successfully: ${email}`)
        
        return res.status(201).json({
            message:"User created successfully",
            user: newUser
        })
    }
    catch(err){
        logger.error(`Error occurred while signing up: ${err.message}`, err)
        return res.status(500).json({message:"Internal server error",err:err.message})
    }
}


//login 

//lolgout