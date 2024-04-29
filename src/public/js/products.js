const socket = io();

let queryParams = {}
const urlParams = new URLSearchParams(window.location.search);
const sort = urlParams.get('sort');
const page = urlParams.get('page');
const category = urlParams.get('category')
const status = urlParams.get('status')
const limit = urlParams.get('limit')
const usernameCookie = document.cookie.split(';').map(cookie => cookie.trim());

const moreFunc = document.querySelector('#moreFunc')

if (rol === 'admin') {
    moreFunc.innerHTML = `
    <form id="add-product">
        <h2>Add product</h2>

        <div class="form-field">
            <label for="title">Title</label>
            <input type="text" name="title" id="title" >
        </div>

        <div class="form-field">
            <label for="description">Description</label>
            <input type="text" name="description" id="description" >
        </div>

        <div class="form-field">
            <label for="code">Code</label>
            <input type="text" name="code" id="code" >
        </div>

        <div class="form-field">
            <label for="price">Price</label>
            <input type="number" name="price" id="price" >
        </div>

        <div class="form-field">
            <label for="status">Select the status:</label>
            <select id="status" name="status">
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        </div>

        <div class="form-field">
            <label for="stock">Stock</label>
            <input type="number" name="stock" id="stock" >
        </div>

        <div class="form-field">
            <label for="category">Category</label>
            <input type="text" name="category" id="category" >
        </div>

        <div class="form-field">
        <label for="thumbnail">Thumbnail</label>
        <input type="text" name="thumbnail" id="thumbnail">
    </div>

        <button type="submit">Send</button>
    </form>

    <form id="remove-product">
        <h2>Remove product</h2>

        <div class="form-field">
            <label for="id">Id</label>
            <input type="text" name="id" id="id" >
        </div>

        <button type="submit">Send</button>
    </form>

    <div class="response-container" id="response-container"></div>
    `

    document.querySelector('#add-product').addEventListener('submit', (event) => {
        event.preventDefault()
    
        socket.emit('add', {
            id: document.getElementById('id').value,
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            code: document.getElementById('code').value,
            price: document.getElementById('price').value,
            status: document.getElementById('status').value,
            stock: document.getElementById('stock').value,
            category: document.getElementById('category').value,
            thumbnail: document.getElementById('thumbnail').value
        })
        event.target.reset()
    })
    
    document.querySelector('#remove-product').addEventListener('submit', (event) => {
        event.preventDefault()
        const idToRemove = document.getElementById('id').value
        socket.emit('remove', idToRemove)
        event.target.reset()
    })
}

if(sort === 'asc'){
    queryParams.sort = 'asc'
}else if(sort === 'desc'){
    queryParams.sort = 'desc'
}

if(page === null){
    queryParams.page = 1
}else if(!isNaN(page)){
    queryParams.page = page
}

if(category !== null){
    queryParams.category = category
}

if(status === "true"){
    queryParams.status = "true"
}else if(status === "false"){
    queryParams.status = "false"
}

if(!isNaN(limit) && limit > 0 && limit <= 10){
    queryParams.limit = limit
}else{
    queryParams.limit = 10
}

socket.emit('getProducts', queryParams);
socket.on('productsResponse', (response) => {
    if (response.result === 'success') {
        if(rol === "admin"){
            Swal.fire({
                icon: "success",
                title: `Welcome ${userName}, you signed in as admin.`
            })
        }else if(userName !== null){
            Swal.fire({
                icon: "success",
                title: `Welcome ${userName}`
            })
        }
        updateTable(response.payload.docs);
        updatePagination(response.payload);
        if (response.payload.page) {
            const currentPage = response.payload.page;
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('page', currentPage);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({}, '', newUrl);
        }
}});

function updateTable(products) {
    const tableContainer = document.getElementById('products-container');
    tableContainer.innerHTML = ''; 
    const productsContainer = document.querySelector('#products-container');
    productsContainer.innerHTML = `
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Thumbnail</th>
        </tr>
    `;
    let buttonId = 0;

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product._id}</td>
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.price}</td>
            <td>${product.status}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.thumbnail}</td>
            <button id="button-${buttonId++}">Add to cart</button>
        `;
        tableContainer.appendChild(row);
    });
    products.forEach((product, index) => {
        const button = document.getElementById(`button-${index}`);
        button.addEventListener('click', () => {
            socket.emit('addProductsToCart', cart, product._id);
        }, 1500);
    });
}

function updatePagination(data) {
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    prevButton.addEventListener('click', () => {
        if (data.hasPrevPage) {
            const prevPage = data.prevPage;
            const filters = {
                sort: queryParams.sort,
                category: queryParams.category,
                limit: queryParams.limit,
                status: queryParams.status,
                page: prevPage
            };
            socket.emit('getProducts', filters);
        }
    });

    nextButton.addEventListener('click', () => {
        if (data.hasNextPage) {
            const nextPage = data.nextPage;
            const filters = {
                sort: queryParams.sort,
                category: queryParams.category,
                limit: queryParams.limit,
                status: queryParams.status,
                page: nextPage
            };

            socket.emit('getProducts', filters);
        }
    });
    if (!data.hasPrevPage) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (!data.hasNextPage) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

socket.on('response', (response) => {
    if(response.status === 'success') {
        document.querySelector('#response-container').innerHTML = `<p class="success">${response.message}</p>`;
    } else {
        document.querySelector('#response-container').innerHTML = `<p class="error">${response.message}</p>`;
    }
});