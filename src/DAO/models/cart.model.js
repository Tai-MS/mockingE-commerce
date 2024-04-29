import mongoose from 'mongoose'

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    cartProducts: [{
        quantity: {type: Number, default: 0}, 
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    }],
    total: { type: Number, default: 0, required: true }
})

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel