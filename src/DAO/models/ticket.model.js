import { UUID } from "mongodb";
import mongoose from "mongoose";

const ticketsCollection = 'tickets'

const ticketsSchema = new mongoose.Schema({
    code: {type: String, required: true},
    purchase_datetime: {type: Array, required: true},
    amount: {type: Number, required: true},
    purchaser: {type: String, required: true}
})

const ticketModel = mongoose.model(ticketsCollection, ticketsSchema)

export default ticketModel