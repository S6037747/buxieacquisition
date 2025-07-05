import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

export const register = async (request, response) => {
    const {name, email, password} = request.body;

    // won't accept a request if name, email or password are not entered.
    if(!name || !email || !password){
        return response.json({
            success: false,
            message: 'Missing details'
        });
    }

    // Try loop to prevent script from breaking if a error accurs.
    try {
        
        const existingUser = await userModel.findOne({email});

        // Checks if a user already exists
        if(existingUser){
            return response.json({
            success: false,
            message: 'User already exists'
        });
        }

        // Encrypting password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = new userModel({name, email: email, password: hashedPassword});

        // User will be saved to the database
        await user.save();

        // cookies
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        response.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending welcome email

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to buxieacquisition',
            text: `Dear ${name},
            
            Your account has been created for the website. You can now login with your email: ${email}`
        }

        await transporter.sendMail(mailOptions)

        return response.json({success: true});


    } catch(error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export const login = async(request, response) => {
    const{email, password} = request.body;

    if(!email || !password){
        return response.json({
            success: false,
            message: 'Email or Password required'
        });
    }

    try {
        const user = await userModel.findOne({email});

        // Checks if a user with a specific email exists
        if(!user){
            return response.json({
            success: false,
            message: 'Invalid email'
        });
        }

        // Checks password match
        const isMatch = await bcrypt.compare(password, user.password);
        
        if(!isMatch){
            return response.json({
            success: false,
            message: 'Invalid password'
        });
        }

        // cookies
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        response.cookie('token', token ,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return response.json({success: true});

    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export const logout = async(request, response) => {

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

export const sendVerifyOtp = async (request, response) => {
    
    // Send Verification OTP to the user's email
    try {
        const {userId} = request.body;
        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return response.json({
            success: false,
            message: 'Account already verified'
        }); 
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = (Date.now() + 60 * 60 * 1000);

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Confirm your email address',
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        }

        await transporter.sendMail(mailOptions)

        return response.json({
            success: true,
            message: 'OTP email send to user'
        }); 

    } catch (error) {
       // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        }); 
    }
}

export const verifyEmail = async (request, response) => {
    const {otp, userId} = request.body;


    if(!userId || !otp) {
        return response.json({
            success: false,
            message: 'Missing details'
        }); 
    }

    try{

        const user = await userModel.findById(userId);

        if(!user){
            return response.json({
            success: false,
            message: 'User not found'
        }); 
        }

        if(user.verifyOtp === '' || user.verifyOtp !== otp){ 
            return response.json({
            success: false,
            message: 'Invalid OPT'
        }); 
        }

        if(user.verifyOtpExpireAt < Date.now()){
            return response.json({
            success: false,
            message: 'OPT Expired'
        }); 
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        return response.json({
            success: true,
            message: 'Email successfully verified.'
        }); 

    } catch (error) {
       // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        }); 
    }
}

export const isAuthenticated = async (request, response) => {

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

export const sendResetToken = async (request, response) => {
    const {email} = request.body;

    if(!email){
        return response.json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const user = await userModel.findOne({email});

        if(!user){
            return response.json({
            success: false,
            message: 'User not found'
        });
        }

        const rawToken   = crypto.randomBytes(32).toString('hex');      // 64-char token
        const tokenHash  = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.ResetToken = tokenHash;
        user.ResetTokenExpireAt = (Date.now() + 15 * 60 * 1000);

        const verifyUrl =
        `${process.env.CLIENT_URL || process.env.FRONTEND_URL}` +
        `/reset-password?token=${rawToken}`;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Reset your password',
            html: PASSWORD_RESET_TEMPLATE.replace(/{{link}}/g, verifyUrl).replace(/{{FRONTEND}}/g, process.env.FRONTEND_URL)
        };

        await transporter.sendMail(mailOptions);

        return response.json({
            success: true,
            message: 'Reset token email send to user'
        }); 

    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}

export const resetPassword = async (request, response) => {
    const {token, newPassword} = request.body;

    if(!token){
        return response.json({
            success: false,
            tokenAuth: false,
            message: "Missing details"
        });
    }

    try {
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await userModel.findOne({ResetToken: tokenHash});

        if (!user || user.ResetToken !== tokenHash || user.ResetToken === "") {
            return response.json({
                success: false,
                tokenAuth: false,
                message: "Token invalid"
    });
}

        if(user.ResetTokenExpireAt < Date.now()){
            return response.json({
            success: false,
            tokenAuth: false,
            message: 'Token Expired'
        }); 
        }

        if(!newPassword && user.ResetToken === tokenHash){
        return response.json({
            success: false,
            tokenAuth: true,
            message: "Token valid"
        });
    }

         // Encrypting password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword
        user.ResetToken = '';
        user.ResetTokenExpireAt = 0;

        await user.save();

        return response.json({
            success: true,
            message: 'Password succesfully changed'
        }); 

    } catch (error) {
        // Catch if a error occurs
        return response.json({
            success: false,
            message: error.message
        });
    }
}