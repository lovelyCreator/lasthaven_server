const db = require("../models");
const BuyTicket = db.buyTickets;
const Ticket = db.tickets;

// Create and Save a new code
exports.create = async (req, res) => {

    const buytickets = new BuyTicket({
        tickets: req.body.tickets,
        sign: req.body.sign,
        publicKey: req.body.publicKey,
        nickName: req.body.nickName
    });
    buytickets
        .save(buytickets)
        .then((data) => {
            BuyTicket.find({ publicKey: req.body.publicKey }).then((data) => {
                let total = 0;
                for (let i = 0; i < data.length; i++) {
                    total = total + data[i].tickets
                }
                console.log("total---->", total)
                const response = {
                    total: total,
                    status: "success",
                };
                res.send(response);
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Spots.",
            });
        });


};

exports.getTokens = async (req, res) => {
    BuyTicket.find({ publicKey: req.body.address }).then((data) => {
        let total = 0;
        for (let i = 0; i < data.length; i++) {
            total = total + data[i].tickets
        }
        const response = {
            total: total,
            status: "success",
        };
        res.send(response);
    });
};
exports.getInvaild = async (req, res) => {
    const data = await Ticket.find({});
    const targetTime = new Date(`${data[0].deadline}:00`).getTime();
    const currentTime = new Date().getTime();
    if (targetTime - currentTime < 0) {
        res.send("expired")
    } else {
        res.send("agree")
    }
};

exports.getBuyTickets = async (req, res) => {
    const data = await BuyTicket.find({});
    res.send(data)
};

exports.getPurchased = async (req, res) => {
    const data = await BuyTicket.find({});
    let counter = 0;
    for(let i = 0; i < data.length; i++){
        counter = counter + data[i].tickets
    }
    res.send(counter.toString())
};