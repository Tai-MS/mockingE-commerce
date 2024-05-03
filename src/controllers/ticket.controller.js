import ticketPersistence from "../persistence/ticket.persistence.js";
import userPersistence from "../persistence/usersData.js";
import cartsPersistance from "../persistence/cartsData.js";
import productsData from '../persistence/productsData.js'

async function verifyStock(req) {
    const cID = req.params.cid;
    const withoutStock = [];
    const cart = await cartsPersistance.getCartsById(cID);
    let amount
    for (let product of cart.cartProducts) {
        console.log(`Primera condicion: ${product.productId.stock >= product.quantity}`);
        console.log(`Segunda condicion: ${product.productId.stock < product.quantity && product.productId.stock > 0}`);
        if (product.productId.stock >= product.quantity) {
            const act = product.productId.stock - product.quantity;
            await productsData.updateProduct(product.productId._id.toString(), { stock: act });
            amount = cart.total
            console.log('amount', amount);
            await cartsPersistance.deleteProductOfCart(cID, product.productId._id.toString());
        }else if(product.productId.stock < product.quantity && product.productId.stock > 0){
            await productsData.updateProduct(product.productId._id.toString(), { stock: 0 });
            await cartsPersistance.deleteProductOfCart(cID, product.productId._id.toString(), product.productId.stock);
        } else {
            console.log("AMOUNTS ",product.productId.price * (product.quantity - product.productId.stock));
            withoutStock.push({
                productName: product.productId.title,
                productId: product.productId._id.toString(),
                amount: product.productId.price * (product.quantity - product.productId.stock),
            });
        }
    }
    return {withoutStock, amount};
}

async function generate(req, res){
    const cID = req.params.cid
    const cart = await cartsPersistance.getCartsById(cID)
    const cartProductsLength = cart.cartProducts.length
    const user = await userPersistence.getUser(cID)
    const prodStock = await verifyStock(req)
    if(cartProductsLength === 0){
        return res.send(`El carrito está vacío`)

    }else if( prodStock.withoutStock.length > 0){
        return res.send(`Los productos en el carrito no se encuentran disponibles`)

    }else if(prodStock.length > 0 && cart.cartProducts.length < cartProductsLength ){
        return res.send(`${await ticketPersistence.generateTicket(user, prodStock.amount)}. Productos no disponibles:${prodStock}`)
    }else if(cart.cartProducts.length <= cartProductsLength){
        return res.send(`${await ticketPersistence.generateTicket(user, prodStock.amount)}.`)
    }
    return res.send(`No se pudo realizar la compra. Productos sin stock: ${prodStock}`)
}
export default {
    generate
}