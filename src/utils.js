import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
import { mongoose } from 'mongoose'

const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)
dotenv.config();
const PORT = process.env.PORT
const MONGO_CONNECT = process.env.MONGO_CONNECT
export function connections(){

    mongoose.connect(MONGO_CONNECT)
    .then(() => {
        console.log('Connected to data base');
    })
    .catch(error => {
        console.error(`Error connecting to data base. Error: ${error}`);
    })}
    
    export const connectDb = async () => {
      try {
        await mongoose.connect(MONGO_CONNECT);
        console.log("Base de datos conectada");
      } catch (err) {
        console.log(err);
      }
    };
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))