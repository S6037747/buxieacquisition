const isAuthenticated = async (request, response) => {

    try {
        return response.json({
            success: true,
        });
    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export default isAuthenticated;