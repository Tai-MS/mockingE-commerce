import { v4 as uuidv4 } from "uuid"; // Importa uuidv4 del paquete uuid
import ticketModel from "../DAO/models/ticket.model.js";
import cartModel from '../DAO/models/cart.model.js'
import cartsPersistance from "./cartsData.js";

class TicketPersistence {
    async generateTicket(user, amount) {
        const now = new Date();

        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const date = `Fecha ${day}/${month}/${year}`;
        const hour = `Hora ${hours}:${minutes}:${seconds}`;

        const code = uuidv4(); 

        const cart = await cartModel.find({_id: await user.cart})
        const purchaser = `${user.firstName} ${user.lastName}`
        const purchase_datetime = [date, hour];

        try {
            const newTicket = await ticketModel.create({
                code: code,
                purchase_datetime: purchase_datetime,
                amount: amount,
                purchaser: purchaser 
            });
            console.log(await cartsPersistance.deleteAllProducts({_id: await user.cart}))
            return newTicket;
        } catch (error) {
            console.error("Error creating ticket:", error);
            throw error; 
        }
    }
}

const ticketPersistence = new TicketPersistence();

export default ticketPersistence;
