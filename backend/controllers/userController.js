import userModel from "../models/userModel.js";

export const getUserData = async (request, response) => {
    try {
        const {userId} = request.body;

        const user = await userModel.findById(userId);

        if(!user){
            return response.json({
            success: false,
            message: 'User not found'
        });
        }

        return response.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}
