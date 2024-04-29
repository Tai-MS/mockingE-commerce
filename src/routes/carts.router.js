import express from 'express'
import cartsController from '../controllers/carts.controller.js'

const router = express.Router()

//endpoints
router.get('/api/carts', async(req, res) => {
    cartsController.getCarts(req, res)
})

router.get('/api/carts/:cid', async(req, res) => {
    cartsController.getCartsById(req, res)
})

router.post('/api/carts/', async(req, res) => {
    cartsController.createCart(req, res)
})

router.put('/api/carts/:cid/products/:pid', async(req, res) => {
    cartsController.addProductToCart(req, res)
})

router.put('/api/carts/:cid', async(req, res) => {
    cartsController.addMultiProducts(req, res)
})

router.delete('/api/carts/:cid/products/:pid', async(req, res) => {
    cartsController.deleteProductOfCart(req, res)
})

router.delete('/api/carts/:cid', async(req, res) => {
    cartsController.deleteAllProducts(req, res)
})

export default router