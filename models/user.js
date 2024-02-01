import mongoose from "mongoose";
import Joi from "joi"
import jwt from 'jsonwebtoken'


let userSchema = mongoose.Schema({
    userName: String,
    password: String,
    email: String,
    role: {type:String,default:'USER'},
    joinDate: {type:Date,default:Date.now()}
})

const User = mongoose.model("users", userSchema,);

function userValidator(req_user) {
    const schema = Joi.object({
        userName: Joi.string().pattern(/^[^\t]$/).required(),//שם משתמש ללא רווחים
        password: Joi.string().min(6).max(30).alphanum().required(),
        email: Joi.string().email().required(),
        // role: Joi.string().pattern(/^[A-Z]{4,10}$/i).default('USER')
    });
    return schema.validate(req_user);
}


function userLoginValidator(req_user) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).alphanum().required(),
    })
    return schema.validate(req_user)
}

function generateToken(user) {
    let secretKey = process.env.JWT_STR;
    let data = {
        _id:user._id,
        userName: user.userName,
        password: user.password,
        role: user.role
    };
    let token = jwt.sign(data, secretKey, { expiresIn: '40m' });
    return token;
}
export { User, userValidator, generateToken,userLoginValidator}

