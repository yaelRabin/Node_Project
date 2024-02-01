import bcrypt, { compare, hash } from 'bcrypt'
import { User, userValidator, generateToken, userLoginValidator } from '../models/user.js'
import mongoose from 'mongoose';


async function getAllUsers(req, res) {
    try {
        let allUsers = await User.find({},"-password")
        return res.json(allUsers);
    }
    catch (error) {
        res.status(400).json({ type: "getAllUsers process  failed", message: error.message })
    }
}

async function getById(req, res) {
    let { id } = req.params;
    if (!id)
        return res.status(400).json({ type: 'error with get the user', message: 'missing id!' })
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'error with get the user', message: 'id is not valid object' })
        let user = await User.findById(id,"-password")
        if (!user)
            return res.status(404).json({ type: 'cant find this user', message: 'user not fount in the system' })
        return res.json({ user })
    } catch (error) {
        res.status(400).json({ type: 'get-user-by-id process failed', message: err.message })
    }
}


async function addUser(req, res) {
    try {
        let validate = userValidator(req.body)
        if (validate.error)
            return res.status(404).json({ type: 'ivalid user', message: validate.error.details[0].message })
        let { userName, password, email, role } = req.body
        let sameUser = await User.findOne({ $or: [{ email }, { userName }] })
        if (sameUser)
            return res.status(409).json({ type: 'similar user', message: 'there is elready exist an user with such email or userName and password' })
        let hashPassword = await bcrypt.hash(password, 9)
        // let user = new User({ userName, password: hashPassword, email, role, joinDate: Date.now() })
        // await user.save()
        let user = await User.create({ ...validate.value, password: hashPassword })
        let token = generateToken(user)
        user = user.toObject();
        delete user.password
        return res.json({ user, token })
    }
    catch (error) {
        res.status(400).json({ type: 'adding user process failed', message: error.message })
    }
}

async function login(req, res) {
    try {
        let validate = userLoginValidator(req.body)
        if (validate.error)
            return res.status(400).json({ type: 'invalid parameters', message: validate.error.details[0].message });
        let { password, email } = req.body
        let user = await User.findOne({ email });
        if (!user || !await compare(password, user.password))
            return res.status(404).json({ type: 'user not found', message: 'you are not exist in our system or one of the details is wrong ' })
        let token = generateToken(user);
        user = user.toObject();
        delete user.password
        return res.json({ user, token })
    }
    catch (error) {
        res.status(400).json({ type: 'login process failed', message: error.message })
    }
}

async function deleteById(req, res) {
    let { id } = req.params
    if (!id)
        return res.status(400).json({ type: 'error with delete', message: 'missing id!' })
    try {
        if (!mongoose.isValidObjectId(id))
            return res.status(400).json({ type: 'error with delete', message: 'id is not valid object' })
        let user = await User.findByIdAndDelete(id)
        if (!user)
            return res.status(404).json({ type: 'cant delete this user', message: 'user not fount in the system' })
            user = user.toObject();
            delete user.password
            return res.json({ message: "user delete :\n", user })
    } catch (error) {
        res.status(400).json({ type: 'delete-user process failed', message: error.message })
    }

}

export { getAllUsers, addUser, login, deleteById, getById }