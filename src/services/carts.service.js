import cartsData from '../persistence/cartsData.js'

async function createCart(){
    return cartsData.createCart()  
}

async function getCarts(){ 
    return cartsData.getCarts()
}

async function getCartsById(cid){
    return cartsData.getCartsById(cid)
}

async function addMultiProducts(cid, productsArr) {
    return cartsData.addMultiProducts(cid, productsArr)
}

async function addProductToCart(cid, pid, add = 1){
    return cartsData.addProductToCart(cid, pid, add)
}

async function deleteProductOfCart(cid, pid){
    return cartsData.deleteProductOfCart(cid, pid)
}

async function deleteAllProducts(cid){
    return cartsData.deleteAllProducts(cid)
}

export default {
    getCarts,
    createCart,
    getCartsById,
    addMultiProducts,
    addProductToCart,
    deleteProductOfCart,
    deleteAllProducts
}


