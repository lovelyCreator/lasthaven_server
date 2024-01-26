module.exports = (mongoose) => {
    var schema = mongoose.Schema(
      {
        tickets: Number,
        sign: String,
        publicKey: String,
        nickName: String
      } /*  */,
      { timestamps: true }
    );
  
    schema.method("toJSON", function () {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const BuyTicket = mongoose.model("BuyTicket", schema);
    return BuyTicket;
  };