module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        id: String,
        walletAddress: String,
        username: {
          type: String,
          equired: true,
          unique: true
        },
        avatar: String,
        logined: false,
        unreadmsg: []
      }
    );
  
    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });
  
    const ChatUser = mongoose.model("chatuser", schema);
    return ChatUser;
  };
