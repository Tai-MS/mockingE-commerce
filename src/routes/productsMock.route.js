import express from 'express';
import generateProduct from '../services/productsMock.service.js';

const router = express.Router();

router.get('/', (req, res) => {
    let product = []
    for(let i = 0; i < 100; i++){
         product.push(generateProduct());
    }
    res.json(product);
});

export default router;
