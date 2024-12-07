import bcrypt from 'bcrypt';
import authUser from '../model/user.model.js';
import jwt from 'jsonwebtoken';


export const signUp = async (req, res) => {
    const {username, email, password} = req.body;
    const hashpassword = bcrypt.hashSync(password, 10);
    try{
        if(!username || !email){
            return res.status(400).json({success: false, message: 'username and email required'});
        }
        const existUser = await authUser.findOne({$or: [{email}, {username}]});
        if(existUser){
           return res.status(406).json({success: false, message: 'Already Exist'});
        }

        const newUser = new authUser({username, email, password: hashpassword});
        newUser.save();
        res.status(200).json({success: true, message: 'Create success'});
    } catch(error){
        console.log('Server Error', error.message);
        res.status(400).json({success: false, message: 'Server is Error'});
    }
};

export const login = async (req, res) => {
    const { email, password} = req.body;
    try {
        const user = await authUser.findOne({email});

        if(!user){
            return res.status(400).json({success: false, message: 'Wrong credentials'});
        }

        const correctPassword = await bcrypt.compare(password, user.password);
        if(!correctPassword){
            return res.status(400).json({success: false, message: 'Invalid Password'});
        }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
    const currentTimeUTC = new Date();
    const expiryDateGMT8 = new Date(currentTimeUTC.getTime() + (8 * 60 * 60 * 1000));
    expiryDateGMT8.setHours(expiryDateGMT8.getHours() + 1);
    res.cookie('acess-token', token, {
        httpOnly: true, 
        expires: expiryDateGMT8,
        secure: process.env.NODE_ENV === 'production'});

    return res.status(200).json({success: true, message: 'Successfully LogIn'});

    } catch (error) {
        console.log('Server Error', error.message);
        res.status(400).json({success: false, message: 'Server is Error'});
    }
};