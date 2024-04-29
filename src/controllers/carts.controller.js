import productModel from "../DAO/models/product.model.js"
import cartsService from "../services/carts.service.js"
async function createCart(req, res){
    let response = await cartsService.createCart()
    res.send(response) 
}

async function getCarts(req, res){
    let response = await cartsService.getCarts()
    res.send(response) 
}

async function getCartsById(req, res){
    let response = await cartsService.getCartsById(req.params.cid)
    res.send(response)     
}

async function addMultiProducts(req, res){
    let response = await cartsService.addMultiProducts(req.params.cid, req.body)
    res.send(response)
}

async function addProductToCart(req, res){
    console.log('asdasd');
    const product = { _id } = req.body
    const p = await productModel.find({_id: _id})
    console.log(p);
    if(!product){
        throw new CustomError({
            name: "Error al editar el producto",
            cause: generateErrorProduct({ email, password }),
            message: "Producto no encontrado",
            code: EErrors.ADDING_PRODUCT_TO_CART_ERROR,
        });
    }
    let response = await cartsService.addProductToCart(req.params.cid, req.params.pid, req.body.add)
    res.send(response)
}

async function deleteProductOfCart(req, res){
    let response = await cartsService.deleteProductOfCart(req.params.cid, req.params.pid)
    res.send(response)
}

async function deleteAllProducts(req, res){
    let response = await cartsService.deleteAllProducts(req.params.cid)
    console.log('resposne', response);

    res.send(response)
}

export default {
    createCart,
    getCarts,
    getCartsById,
    addMultiProducts,
    addProductToCart,
    deleteProductOfCart,
    deleteAllProducts
}