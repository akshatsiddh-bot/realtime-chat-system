import AuthUser from "../models/auth-user.model.js";
import argon from "argon2";
import logger from "../config/logger.js";
import jwt from "jsonwebtoken";

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
export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;

        // check if user exists 
        const user = await AuthUser.findOne({email})
        if (!user){
            logger.info(`User not found with email: ${email}`)
            return res.status(404).json({
                message:"User not found with the provided email",
            })
        }

        // verufy pwd
        const isPasswordValid = await argon.verify(user.password,password)
        if (!isPasswordValid){
            logger.info(`Invalid password for user: ${email}`)
            return res.status(401).json({
                message:"Invalid password",
            })
        }

        // generate jwt token
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})

        logger.info(`User logged in successfully: ${email}`)
        res.cookie("token", token)
        return res.status(200).json({
            message:"User logged in successfully",
            user: user,
            token: token
        })
    }catch(err){
        logger.error(`Error occurred while logging in: ${err.message}`, err)
        return res.status(500).json({message:"Internal server error",err:err.message})
    }
}



//lolgout
export const logout = async(req,res)=>{
    try{

    }
    catch(err){
        logger.error(`Error occurred while logging out: ${err.message}`, err)
        return res.status(500).json({message:"Internal server error",err:err.message})
    }
}