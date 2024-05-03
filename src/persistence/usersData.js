import userModel from "../DAO/models/user.model.js";
import { createHash } from "../utils.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateErrorProduct } from '../services/errors/info.js';

import { devLogger, prodLogger, addLogger } from '../utils/logger.js'


dotenv.config()

class UserPersistence {
    async createUser(newUserInfo){
        try {
            const firstName = newUserInfo.firstName;
            const lastName = newUserInfo.lastName;
            const email = newUserInfo.email;
            const age = newUserInfo.age;
            const password = newUserInfo.password;
            const userRole = email === process.env.ADMIN_EMAIL ? 'admin' : 'user';

            const user = await userModel.create({
                firstName,
                lastName,
                email,
                age,
                password: createHash(password),
                role: userRole
            });
            devLogger.info('INFO: usuario creado')
            prodLogger.info('INFO: usuario creado')
            return user.save();
        } catch (error) {
            if (error.errors) {
                const errorMessage = Object.values(error.errors).map(err => err.message).join(', ');
                prodLogger.fatal(`ERROR creando usuario: ${errorMessage}`)
                return `Validation error: ${errorMessage}`;
            } else if (error.code === 11000) {
                prodLogger.error(`ERROR email en uso: ${error.code}`)
                return true
            } else {
                prodLogger.fatal(`ERROR creando usuario (internal server): ${error.code}`)
                return 'Internal server error';
            }
        }
    }

    async login(userCredentials, userSession) {
        try {
            const email = userCredentials.email;
            const password = userSession;
    
            const user = await userModel.findOne({ email });
            
            if (!user) {
                devLogger.warning('INFO: usuario no vàlido')
                prodLogger.warning('INFO: usuario no válido')
              return 'error 1';
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                devLogger.warning('INFO: contraseña no válida')
                prodLogger.warning('INFO: contraseña no válida')
              return 'error 2'
            }
                
            if (userCredentials.email === "adminCoder@coder.com" && isPasswordValid) {
                user.role = 'admin';
                await user.save();
                devLogger.info('INFO: Sesión iniciada')
                prodLogger.info('INFO: Sesión iniciada')
                return `/products?username=${userCredentials.user.firstName}`;
            } else {
                user.role = 'user';
                await user.save();
                devLogger.info('INFO: Sesión iniciada')
                prodLogger.info('INFO: Sesión iniciada')
                return `/products?username=${userCredentials.firstName}`;
            }
        } catch (error) {
            devLogger.error('ERROR: error al iniciar sesión')
            prodLogger.error('ERROR: error al iniciar sesión')
            return error;
        }
    }

    async changePassword(userCredentials, userSession){
        try {
            const email = userCredentials.email;
            const password = userCredentials.password;
    
            const user = await userModel.findOne({ email });
            if (!user) {
              return 'error';
            }
            if(password === userCredentials.confirmPassword){
                await userModel.updateOne({email: email}, {password: createHash(password)})
                return await user.save();
            }else{
                return 'error'
            }
        } catch (error) {
            return error
        }
    }

    async getUser(cId){
        const user = await userModel.findOne({cart: cId})
    
        if(user){
            return user
        }

        return false
    }
}

const userPersistence = new UserPersistence();

export default userPersistence;
