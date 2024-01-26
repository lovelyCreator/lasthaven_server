module.exports = app => {
    const buyTickets = require("../controllers/buyTickets.controller.js")
  
    var router = require("express").Router();
  
    // Create a new Code
    router.post("/create", buyTickets.create);
    router.post("/getTokens", buyTickets.getTokens);
    router.post("/getInvaild", buyTickets.getInvaild);
    router.post("/getBuyTickets", buyTickets.getBuyTickets)
    router.post("/purchasedTickets", buyTickets.getPurchased)
    app.use("/api/buyTicketInfo", router);
  };