import express from 'express'
import productController from '../controllers/product.controller.js'
import CustomError from "../services/errors/customErrors.js";
import EErrors from "../services/errors/enums.js";
import { generateErrorInfo } from "../services/errors/info.js";

const router = express.Router()

//endpoints
router.get('/api/products', async (req, res) => {
    productController.getProducts(req, res)
})

router.get('/api/products/:pid', async(req, res) => {
    productController.getProductsById(req, res)
})

router.post('/api/products', async(req, res) => {
    productController.addProduct(req, res)
})

router.put('/api/products/:pid', async(req, res) => {
    productController.updateProduct(req, res)
})

router.delete('/api/products/:pid', async(req, res) => {
    productController.deleteProduct(req, res)
})
export default router