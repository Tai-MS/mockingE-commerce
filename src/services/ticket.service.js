import ticketPersistence from "../persistence/ticket.persistence";

async function generateTicket(user){
    ticketPersistence.generateTicket(user)
}

export default{
    generateTicket
}