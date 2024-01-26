const db = require("../models");
const Ticket = db.tickets;

// Create and Save a new code
exports.create = async (req, res) => {
    await Ticket.deleteMany({})
    const ticket = new Ticket({
        ticketNum: req.body.ticketNum,
        deadline: req.body.deadline,
        image: req.body.image,
        ticketName: req.body.ticketName,
        closeStatus: true,
    });
    ticket
        .save(ticket)
        .then((data) => {
            Ticket.find({}).then((data) => {
                const response = {
                    data: data,
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

exports.endedTime = async (req, res) => {
    const data = await Ticket.find({})
    res.send(data[0].deadline);
};

exports.getTicketInfo = async (req, res) => {
    const data = await Ticket.find({})
    res.json(data[0]);
};

exports.closeTicket = async (req, res) => {
    const data = await Ticket.find({});
    await Ticket.findOneAndUpdate({_id: data[0]._id}, {deadline: "2023-01-25T00:00"}) 
    res.send("success");
};