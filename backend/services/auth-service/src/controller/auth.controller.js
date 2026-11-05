import AuthUser from "../models/auth-user.model.js";
import argon from "argon2";
import logger from "../config/logger.js";
import jwt from "jsonwebtoken";
import axios from "axios";


// signup 

export const signup = async (req, res) => {
    let newUser;

    try {
        const { name, email, password } = req.body;

        // Check whether user already exists
        const exists = await AuthUser.findOne({ email });

        if (exists) {
            return res.status(400).json({
                success: false,
                message: "User already exists with the same email"
            });
        }

        // Hash password
        const hashedPassword = await argon.hash(password);

        // Create user in Auth Service
        newUser = await AuthUser.create({
            name,
            email,
            password: hashedPassword
        });

        logger.info(`User created in Auth Service: ${email}`);

        // Create profile in User Service
        try {
            await axios.post(
                `${process.env.USER_SERVICE_URL}/api/v1/user/internal/create-profile`,
                {
                    authUserId: newUser._id.toString(),
                    name: newUser.name,
                    email: newUser.email
                },
                {
                    timeout: 5000
                }
            );

            logger.info(`Profile created successfully: ${email}`);

        } catch (serviceError) {
            logger.error(
                `User Service profile creation failed: ${serviceError}`
            );

            // Compensating action: remove AuthUser
            await AuthUser.findByIdAndDelete(newUser._id);

            return res.status(503).json({
                success: false,
                message: "Registration failed. Please try again."
            });
        }

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (err) {
        logger.error(`Signup error: ${err.message}`);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



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
        res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
    path: "/"
});
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
        res.clearCookie("token")
        logger.info(`User logged out successfully`)
        return res.status(200).json({
            message:"User logged out successfully",
        })
    }
    catch(err){
        logger.error(`Error occurred while logging out: ${err.message}`, err)
        return res.status(500).json({message:"Internal server error",err:err.message})
    }
}