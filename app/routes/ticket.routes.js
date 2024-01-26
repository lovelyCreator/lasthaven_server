module.exports = app => {
    const tickets = require("../controllers/ticket.controller.js")
  
    var router = require("express").Router();
  
    // Create a new Code
    router.post("/create", tickets.create);
    // Get ended time
    router.post("/endedTime", tickets.endedTime);
    // Get TicketINfo
    router.post("/getTicketInfo", tickets.getTicketInfo)
    // close ticket
    router.post("/closeTicket", tickets.closeTicket);
    app.use("/api/ticket", router);
  };