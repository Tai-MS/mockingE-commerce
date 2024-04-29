import productsPersistence from "../persistence/productsData.js";

async function addProduct(newProduct){

}

async function getTotalPages(sort, category, limit = 10, status){
    try {
        let sortOptions;
        let filter = {}

       
        if (limit > 10) {
            limit = 10;
        }
        
        if(status === "true"){
            filter.status = true
        }else if(status === "false"){
            filter.status = false
        }


        if (sort === 'asc') {
            sortOptions = { price: 1 };
        } else if (sort === 'desc') {
            sortOptions = { price: -1 };
        }
        
        if(category !== undefined){
            filter.category = category
        }
        const options = {
            limit: limit,
            sort: sortOptions
        }
        const getAll = await productModel.paginate(filter, options);
        return getAll.totalPages

    } catch (error) {
        throw new Error(error);
    }
}

async function getProductsById(pid){
    
}

async function getProducts(newProduct){
    
}

async function updateProduct(pid, updatedFields){

}

async function deleteProduct(pid){

}

export default {
    addProduct,
    getTotalPages,
    getProductsById,
    getProducts,
    updateProduct,
    deleteProduct
}