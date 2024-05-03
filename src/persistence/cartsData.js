import cartModel from '../DAO/models/cart.model.js'
import productModel from '../DAO/models/product.model.js'
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateErrorProduct } from '../services/errors/info.js';

import { devLogger, prodLogger, addLogger } from '../utils/logger.js'

class CartsPersistance {
    static #instance

    static getInstance(){
        if(!CartsManager.#instance){
            CartsManager.#instance = new CartsManager
        }
        return CartsManager.#instance
    }

    async createCart(){
        try {
            const createElement = await cartModel.create({quantity: 0})
            devLogger.info(`INFO: registrado nuevo cart`)
            return `Cart created. Cart ID: ${createElement._id}`
        } catch (error) {
            prodLogger.fatal(`FATAL: no se pudo crear el nuevo cart`)
            return `Error: ${error}`
        }    
    }

    async getCarts(){
        try {
            const carts = await cartModel.find()
            if(carts){
                devLogger.info(`INFO: obteniendo todos los carts`)
                return carts
            }else{
                devLogger.error(`ERROR: no se encontraron carts`)
                prodLogger.error(`ERROR: no se encontraron carts`)
                return 'There are no carts'
            }
        } catch (error) {
            prodLogger.fatal(`FATAL: no se pudo obtener los carts`)
            return `Error: ${error}`
        }    
    }

    async getCartsById(cid){
        try {
            const cart = await cartModel.findById(cid).populate('cartProducts.productId');
            if(cart){
                devLogger.info(`INFO: obteniendo el cart`)
                return cart
            }else{
                devLogger.error(`ERROR: no se encontró el cart`)
                prodLogger.error(`ERROR: no se encontró el cart`)
                return 'Cart not found'
            }
        } catch (error) {
            prodLogger.fatal(`FATAL: no se pudo obtener el cart`)
            return error
        }        
    }

    async addMultiProducts(cid, productsArr) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            let notFoundArr = []
            if (!cart) { 
                devLogger.warning(`WARNING: no se encontró el cart`)
                prodLogger.warning(`WARNING: no se encontró el cart`)
                return 'Cart not found';
            }
            devLogger.info(`INFO: obteniendo el cart`)
            const productIds = Object.values(productsArr['products']);
            await Promise.all(productIds.map(async (productId) => {
                const productExist = await productModel.findById(productId['product']);
                if (productExist !== null) {
                    notFoundArr.push(productId['pid']);
                }
                await this.addProductToCart(cid, productId['pid'], productId["quantity"]);
                
            }));
            if(notFoundArr.length > 0){
                return `Products added. Except for ${notFoundArr}`
            }
            return 'Products added successfully';
        } catch (error) {
            return `Error: ${error}`;
        }
    } 

    async addProductToCart(cid, pid, add = 1) {
        try {
            // const p = await productModel.find({_id: pid})
            const product = await productModel.findOne({ _id: pid });
            if(!product){
                devLogger.warning('WARNING: producto no encontrado')
                prodLogger.warning('WARNING: producto no encontrado')
                throw new CustomError({
                    name: "Error al editar el producto",
                    cause: generateErrorProduct({ email, password }),
                    message: "Producto no encontrado",
                    code: EErrors.ADDING_PRODUCT_TO_CART_ERROR,
                });
            }
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                devLogger.info('WARNING: cart no encontrado')
                prodLogger.info('WARNING: cart no encontrado')
                return 'Cart not found';
            }
    
            // if (!product) {
            //     return 'Product not found';
            // }
           
            const existingProduct = cart.cartProducts.find(info => info.productId.toString() === pid);
            const productPrice = parseInt(product.price)
            const previousTotal = cart.total 
            const total = previousTotal + productPrice
            if (!existingProduct) {
                cart.cartProducts.push({
                    quantity: add,
                    productId: pid
                });
                await cartModel.updateOne({_id: cart._id}, {total: total})
                await cart.save();
                devLogger.info('INFO: el producto se añadió al carrito')
                prodLogger.info('INFO: el producto se añadió al carrito')
                return cart;
            } else {
                existingProduct.quantity += add;
                cart.total += productPrice
                devLogger.info('INFO: se modificó la cantidad en el carrito')
                prodLogger.info('INFO: se modificó la cantidad en el carrito')
                await cart.save();
                return cart;
            }
        } catch (error) {
            return `Error: ${error}`;
        }
    }

    async deleteProductOfCart(cid, pid, quantityToDelete = 1) {
        try {
            const cart = await cartModel.findOne({ _id: cid });
            if (!cart) {
                return `Cart not found`;
            }
    
            const productIndex = cart.cartProducts.findIndex((element) => element.productId.toString() === pid);
            if (productIndex !== -1) {
                const productTitle = await productModel.findOne({ _id: pid })
                const productQuantity = cart.cartProducts[productIndex].quantity;
                if (productQuantity > 1) {
                    cart.cartProducts[productIndex].quantity -= quantityToDelete;

                    cart.total -= productTitle.price * quantityToDelete
                    await cart.save();
                    // return `The product: ${productTitle.title} quantity was reduced. You still have: ${productQuantity - 1} unit(s) of this product.`;
                } else {
                    cart.cartProducts.splice(productIndex, 1);
                    cart.total -= productTitle.price
                    await cart.save();
                    return `${productTitle} removed from cart.`;
                }
            } else {
                return `Product not found in cart`;
            }
        } catch (error) {
            return `Error: ${error}`;
        }
    }
    

    async deleteAllProducts(cid){
        try {
            const cart = await cartModel.findOne({_id: cid});
            if (!cart) {
                return 'Cart not found';
            }
            const cartLength = cart.cartProducts.length
            cart.cartProducts = [];
            cart.total = 0
            if(cartLength === 0){
                return 'Cart empty'
            }

            // cart.cartProducts.splice(0, cart.cartProducts.length)
            cart.save()
            return 'All products removed.';
        } catch (error) {
            return `Error: ${error}`
        }        
    }
}

const cartsPersistance = new CartsPersistance

export default cartsPersistance