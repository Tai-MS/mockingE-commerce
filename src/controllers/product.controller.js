import productService from '../services/products.service.js'
import productModel from '../DAO/models/product.model.js';

async function addProduct(req, res){
    
    let response = await productsManager.addProduct(req.body)
    res.json(response)
}

function getTotalPages(req, res){
    
}

async function getProductsById(req, res){
    let response = await productsManager.getProductsById(req.params.pid)
    res.json(response)
}

async function getProducts(req, res){
    try {
        const products = await productsManager.getProducts(req.query.sort, req.query.category, req.query.page, req.query.limit, req.query.status);
        const currentPage = parseInt(req.query.page); 
        let prevPage = null;
        let nextPage = null;
        if (currentPage > 1) {
            const prevPageUrl = `${req.originalUrl.replace(/page=\d+/g, `page=${currentPage - 1}`)}`;
            prevPage = prevPageUrl;
        }

        if (currentPage < products.totalPages) {
            const nextPageUrl = `${req.originalUrl.replace(/page=\d+/g, `page=${currentPage + 1}`)}`;
            nextPage = nextPageUrl;
        }

        const modifiedProducts = {
            ...products,
            prevPage: prevPage,
            nextPage: nextPage
        };

        res.send({ result: 'success', payload: modifiedProducts });
    } catch (error) {
        res.send({ result: 'error' })
    }
}

async function updateProduct(req, res){
    let response = await productsManager.updateProduct(req.params.pid, req.body)
    res.json(response)
}

async function deleteProduct(req, res){
    let response = await productsManager.deleteProduct(req.params.pid)
    res.json(response)
}
export default {
    addProduct,
    getTotalPages,
    getProductsById,
    getProductsById,
    getProducts,
    updateProduct,
    deleteProduct
}