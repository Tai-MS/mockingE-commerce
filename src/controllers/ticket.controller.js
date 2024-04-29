import ticketPersistence from "../persistence/ticket.persistence.js";
import userPersistence from "../persistence/usersData.js";
import cartsPersistance from "../persistence/cartsData.js";
import productsData from '../persistence/productsData.js'

async function verifyStock(req) {
    const cID = req.params.cid;
    const withoutStock = [];
    const cart = await cartsPersistance.getCartsById(cID);
    for (let product of cart.cartProducts) {
        console.log(`Primera condicion: ${product.productId.stock >= product.quantity}`);
        console.log(`Segunda condicion: ${product.productId.stock < product.quantity && product.productId.stock > 0}`);
        if (product.productId.stock >= product.quantity) {
            const act = product.productId.stock - product.quantity;
            await productsData.updateProduct(product.productId._id.toString(), { stock: act });
            await cartsPersistance.deleteProductOfCart(cID, product.productId._id.toString());
        }else if(product.productId.stock < product.quantity && product.productId.stock > 0){
            await productsData.updateProduct(product.productId._id.toString(), { stock: 0 });
            await cartsPersistance.deleteProductOfCart(cID, product.productId._id.toString(), product.productId.stock);
        } else {
            withoutStock.push({
                productName: product.productId.title,
                productId: product.productId._id.toString(),
                amount: product.productId.price * (product.quantity - product.productId.stock),
            });
        }
    }
    return withoutStock;
}

async function generate(req, res){
    const cID = req.params.cid
    const cart = await cartsPersistance.getCartsById(cID)
    const cartProductsLength = cart.cartProducts.length
    const user = await userPersistence.getUser(cID)
    const prodStock = await verifyStock(req)
    if(prodStock.length > 0 && cart.cartProducts.length < cartProductsLength ){
        return res.send(`${await ticketPersistence.generateTicket(user)}. Productos no disponibles:${prodStock}`)
    }else if(cart.cartProducts.length < cartProductsLength){
        return res.send(`${await ticketPersistence.generateTicket(user)}.`)

    }
    return res.send(`No se pudo realizar la compra. Productos sin stock: ${prodStock}`)
}
export default {
    generate
}