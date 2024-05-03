//External imports
import express from 'express'
import handlebars from 'express-handlebars'
import path from 'path'
import { Server } from 'socket.io'
import MongoStore from 'connect-mongo'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import dotenv from 'dotenv'

import errorHandler from './middlewares/errors/indes.js'

//Internal imports
import initializePassport from './config/passport.config.js'
import {__dirname, connections, connectDb} from './utils.js'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import sessionRouter from './routes/session.router.js'
import viewsRouter from './routes/views.router.js'

import chatManager from './controllers/chat.controller.js'
import productsManager from './persistence/productsData.js'
import cartsManager from './persistence/cartsData.js'

const app = express()
dotenv.config();
const PORT = process.env.PORT
const MONGO_CONNECT = process.env.MONGO_CONNECT
const SECRET_KEY = process.env.SECRET_KEY
//Middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(errorHandler)

//Handlebars config
app.engine('hbs', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, '/public')))

//Passport y express-sessions
initializePassport()
app.use(session({
    secret:SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_CONNECT,
        ttl: 15,
      }),
      secret: SECRET_KEY,
      resave: false,
      saveUninitialized: false,
}))

app.use(cookieParser("myParser"));
connections()

//Routes
app.use('/products', productsRouter)
app.use('/carts', cartsRouter)
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

//Server
const httpServer = app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${PORT}`);
})

//Websocket config
const socketServer = new Server(httpServer)
const users = {}


socketServer.on('connect', async socket => {
    console.log('New client connected');

    socket.on('add', async(newProduct) => {
        try {
            const newProductObject = {
                title: newProduct.title,
                description: newProduct.description,
                code: newProduct.code,
                price: newProduct.price,
                status: newProduct.status,
                stock: newProduct.stock,
                category: newProduct.category,
                thumbnail: newProduct.thumbnail,
            }
            let result = await productsManager.addProduct(newProductObject)
            const products = await productsManager.getProducts()

            socketServer.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                msg: result
            })
            socketServer.emit('response', {status: 'success', message: result})
            
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on('updateProduct', async(pId, fields) => {
        try {
            const updatedFields = {
                title: fields.title,
                description: fields.description,
                code: fields.code,
                price: parseInt(fields.price),
                status: fields.status,
                stock: parseInt(fields.stock),
                category: fields.category,
                thumbnail: fields.thumbnail,
            }
            console.log("fields ",fields);
            console.log(pId);
            let result = await productsManager.updateProduct(pId, updatedFields)
            console.log(result);
            const products = await productsManager.getProducts()
            socketServer.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                msg: result
            })
            socketServer.emit('response', {status: 'success', message: result})
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on('remove', async(pid) => {
        try {
            const response = await productsManager.deleteProduct(pid)
            const products = await productsManager.getProducts()

            socketServer.emit('productsResponse', { 
                result: 'success', 
                payload: products
            })
            socketServer.emit('response', {status: 'success', message: response})
            socketServer.emit('response', {status: 'success', message: response})
        } catch (error) {
            socketServer.emit('response', {status: 'error', message: error.message} )
        }
    })

    socket.on('getProducts', async (query) => {
        try {
            console.log(query);
            const maxPage = await productsManager.getTotalPages(query.sort, query.category, query.limit, query.status)
            if(query.page > maxPage){
                query.page = maxPage
            }
            const products = await productsManager.getProducts(
                query.sort, 
                query.category, 
                query.page, 
                query.limit, 
                query.status
            );
            socket.emit('productsResponse', { 
                result: 'success', 
                payload: products,
                options: query 
            });
        } catch (error) {
            socket.emit('productsResponse', { result: 'error' });
        }
    });  

    socket.on('addProductsToCart', async(cid, pid) => {
        const response = await cartsManager.addProductToCart(cid, pid)
        socket.emit('productsResponse', response)
    })

    socket.on('getCartByIdResponse', async(cid) => {
        const response = await cartsManager.getCartsById(cid.cid);
        socket.emit('cartResponse', response);        
    })

    socket.on('newUser', async(username) => {
        users[socket.id] = username
        socketServer.emit('userConnected', username)
        chatManager.returnChat().then(messages => {
            messages.forEach(message => {
                socket.emit('message', {username: message.user, message: message.message})
            });
        }).catch(error => {
            console.error(`Error: ${error}`);
        })
    })

    socket.on("chatMessage", (message) => {
        const username = users[socket.id]
        if(message.length < 1){
            socketServer.emit("error")
        }else{
            socketServer.emit("response", chatManager.updateDb(users[socket.id],message))
            socketServer.emit("message", { username, message })
        }
    })

    socket.on("disconnect", () => {
        const username = users[socket.id]
        delete users[socket.id]
        socketServer.emit("userDisconnected", username)
    })
})

connectDb();