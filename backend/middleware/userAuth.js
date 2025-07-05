import jwt from "jsonwebtoken";

const userAuth = async (request, response, next) => {
    const {token} = request.cookies;

    if(!token){
        return response.json({
            success: false,
            message: 'Not authorized, please login'
        }); 
    }
    try {

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if(tokenDecode.id){
            request.body = request.body || {};
            request.body.userId = tokenDecode.id;
        } else {
            return response.json({
            success: false,
            message: 'Not authorized, please login'
        }); 
        }
        
        next();

    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export default userAuth;