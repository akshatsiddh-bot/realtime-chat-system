import Profile from "../models/user.model.js"
import logger from "../config/logger.js"    

// get me 
export const getme = async (req, res) => {
    try{
        const user = await Profile.findOne({
    authUserId: req.userId
}).select("-__v");

        if (!user) {
            logger.error("User Profile not found");
        return res.status(404).json({
            message: "User profile not found",
        });
        }

        logger.info("User profile fetched successfully");
        return res.status(200).json({
        success: true,
        user,
        });

    }
    catch (error) {
        logger.error("Error fetching user data:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
}


// used by the auth service in order to create a profile in the user service after a successful registration
export const createProfile = async (req, res) => {
    try {
        const { authUserId, name, email } = req.body;

        const profile = await Profile.findOneAndUpdate(
            { authUserId },
            {
                $setOnInsert: {
                    authUserId,
                    name,
                    email
                }
            },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        return res.status(200).json({
            success: true,
            message: "Profile created or already exists",
            profile
        });

    } catch (error) {
        logger.error(`Profile creation failed: ${error.message}`);

        return res.status(500).json({
            success: false,
            message: "Profile creation failed"
        });
    }
};