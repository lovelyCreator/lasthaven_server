module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        id: String,
        userName: String,
        avatar: String,
        image: String,
        message: String,
        timestamp: Date,
        readed: [String]
      },
      { timestamps: true }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const Chat = mongoose.model("chat", schema);
    return Chat;
  };
