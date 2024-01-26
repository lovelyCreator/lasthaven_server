module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        ticketName: String,
        deadline: String,
        ticketNum: Number,
        image: String
      } /*  */,
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Ticket = mongoose.model("ticket", schema);
    return Ticket;
  };