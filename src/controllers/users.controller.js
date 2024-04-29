import usersService from '../services/user.service.js';
import passport from 'passport'
import UserDTO from '../DTO/user.dto.js';

import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateErrorProduct } from '../services/errors/info.js';

async function createUser(req, res, next){
    const { email, password, firstName, lastName, age } = req.body
    if(!email || !password || !firstName || !lastName || !age){
        throw new CustomError({
            name: "Error al editar el producto",
            cause: generateErrorProduct({ email, password, firstName, lastName, age }),
            message: "El código de producto ya está en uso",
            code: EErrors.SIGN_UP_ERROR,
        });
    }
    passport.authenticate('register', async (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).send('Email already in use.');
        }
        const newUserInfo = req.body;
        await usersService.createUser(newUserInfo); 
        res.redirect('/');
    })(req, res, next);
}


async function login(req, res) {
    const  { email, password } = req.body
    if(!email || !password){
        throw new CustomError({
            name: "Error al editar el producto",
            cause: generateErrorProduct({ email, password }),
            message: "El código de producto ya está en uso",
            code: EErrors.LOGIN_ERROR,
        });
    }
    passport.authenticate('login', { failureRedirect: '/faillogin' })(req, res, async () => {
        const userCredentials = req.session;
        const userSession = req.body;
        await usersService.login(userCredentials, userSession);
        res.cookie('role', req.user.role, { maxAge: 10000, signed: true });
        res.cookie('username', req.session.passport.user.firstName, { maxAge: 100000 });
        return res.redirect('/products');
    });
}

async function changePassword(req, res){
    const userCredentials = req.body
    const userSession = req.session
    if(usersService.changePassword(userCredentials, userSession) !== 'error'){
      
    return res.redirect('/')
  }else{
    return res.send('Password doesn´t match.')
  }
}

function logout(req, res ){
    if (req.session && req.session.passport.user) {
        res.clearCookie('username');
        res.clearCookie('role');
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                res.status(500).send('Internal server error');
            } else {
                console.log('User session destroyed');
                setTimeout(() => {
                    res.redirect('/');
                }, 500)
            }
        });
    } else {
        console.log('No user session found');
        res.redirect('/');
    }
}

function current(req, res){
    const cartId = req.session.passport.user.cart
    const firstName = req.session.passport.user.firstName
    const lastName = req.session.passport.user.lastName
    const userDTO = new UserDTO(firstName, lastName, cartId)
    res.send(JSON.stringify(userDTO.fullName()))
}


export default {
    createUser,
    login,
    changePassword,
    logout,
    current
}
