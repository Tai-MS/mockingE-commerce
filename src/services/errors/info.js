export const generateErrorInfo=(user)=>{
    return `Una o más propiedades estaban incompletas o inválidas.
      Lista de propiedades requeridas:
      * email: necesita un String, se recibió ${user.email}
      * password: necesita un String, se recibió ${user.password}
     `;
   }
export const generateErrorProduct=(product)=>{
    return `Una o más propiedades estaban incompletas o inválidas.
      Lista de propiedades requeridas:
      * title: necesita un String, se recibió ${product.title}
      * description: necesita un String, se recibió ${product.description}
      * code: necesita un String, se recibió ${product.code}
      * price: necesita un String, se recibió ${product.price}
      * status: necesita un String, se recibió ${product.status}
      * stock: necesita un String, se recibió ${product.stock}
      * category: necesita un String, se recibió ${product.category}
      * thumbnail: necesita un String, se recibió ${product.thumbnail}
     
      `;
}