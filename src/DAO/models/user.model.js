import mongoose from "mongoose";
import cartModel from './cart.model.js'

const usersCollection = "users";

const userSchema = new mongoose.Schema({
  firstName: {type: String, required: [true, 'Missing field: first name']},
  lastName: {type: String, required: [true, 'Missing field: lastname']},
  email: {type: String, unique: [true, 'Email already in use.'], required: [true, 'Missing field: email']},
  age: {type: Number, required: [true, 'Missing field: age']},
  password: {type: String, required: [true, 'Missing field: password']},
  role: {type: String, default: 'user'},
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
});

userSchema.pre('save', async function(next) {
  try {
    const newCart = await cartModel.create({ cartProducts: [] }); 
    this.cart = newCart._id; 
    next();
  } catch (error) {
    next(error);
  }
});

const userModel = mongoose.model(usersCollection, userSchema);

export default userModel;