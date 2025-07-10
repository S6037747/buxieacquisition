const logout = async(request, response) => {

    try{
        response.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        });

        return response.json({
            success: true,
            message: 'Logged out'
        });
        
    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export default logout