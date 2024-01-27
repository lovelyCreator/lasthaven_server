const http = require('http');
const { Server } = require("socket.io");
const mongoose = require('mongoose');
const httpServer = http.createServer();
const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
// const db = mongoose.connection;
const db = require("./models");
const Chat = db.chats;
const ChatUser = db.chatusers

io.on('connection', (socket) => {
  console.log('a user connected');
  //-----------------format-------------------------
  socket.on('format', async(message) => {
    const walletAddress = message.walletAddress;
    console.log('wallet: ', walletAddress);
    const filter = {walletAddress: walletAddress};
    const update = {logined: false};
    const existingUser = await ChatUser.updateOne(filter, update);
  })


  //-----------------wallet---------------------------
  socket.on('wallet', async(message) => {
    // console.log('wallet', message.walletAddress);
    const walletAddress = message.walletAddress;
    const existingUser = await ChatUser.findOne({ walletAddress: walletAddress });
    // console.log('user', existingUser)
      if (existingUser) {
        // console.log('abv');
        if(existingUser.unreadmsg.length>0){
          existingUser.unreadmsg.map(async (item, index) => {
            // console.log('item', item);
            const reader = await Chat.findOne({id: item});
            // console.log('red', reader);
            if (reader == null) {
              // console.log('chat is impty');
            }
            else{
              const filter = { id: item };
              const update = { readed: [...reader.readed, existingUser.username] };
              // const update = { readed: [...reader.readed, existing.username] };
              const result = await Chat.updateOne(filter, update);
              const newreader = await Chat.findOne({id: item})
              // console.log('update',newreader);
              // io.emit('message', newreader);
            }
            // io.to(reader).emit('message-read', messageList)
          })
        const filter = { username: existingUser.username };
        const update = { unreadmsg: [] };
        const result = await ChatUser.updateOne(filter, update);
        const updateuser = await ChatUser.findOne({username: existingUser.username})
        const updateMessage = await Chat.find({});
        // console.log('readed', updateuser)
        io.emit('checked', updateMessage);
        // console.log('all:', updateMessage);
        io.emit('Alert', {walletAddress: existingUser.walletAddress, alert: 0});
      }
    }
  })
  //-----------------login-------------------------
  socket.on('login', async(userData) => {
    console.log(userData);
    const existingUser = await ChatUser.findOne({ username: userData.username });
    console.log('existingUser:', existingUser);
    if (existingUser) {
      const message= 'user is already existed.'
      io.to(socket.id).emit('userexist', message);
    }
    else {
      const newUser = new ChatUser({ 
        id: socket.id,
        username: userData.username, 
        walletAddress: userData.walletAddress, 
        avatar: userData.avatarUrl,
        logined: true, 
        unreadmsg: [] 
      });
      newUser.save();
      io.to(socket.id).emit('login', newUser);
      const updateMessages = await Chat.find({});
      updateMessages.map(async (item) => {
        
        const filter = { id: item.id };
        const update = { readed: [newUser.username] };
        // const update = { readed: [...reader.readed, existing.username] };
        const result = await Chat.updateOne(filter, update);
      })
      const updateMessage = await Chat.find({});
      console.log('readed', updateMessage)
      io.emit('checked', updateMessage);
    }
  })

  // socket.on('getmessage', (messageData) => {
  //   const
  // })
//----------------logout--------------------
  socket.on('logout', async (message) => {
    const filter = {username: message.username}
    const update = {logined: message.logined}
    const updateUser = await ChatUser.updateOne(filter, update);
    // console.log('us', updateUser);
  });
//-----------------message------------------
  socket.on('message', async (message) => {
    
    // let messageData;

    // if (message.message instanceof FormData) {
    //   // Handle FormData message
    //   const file = message.get('file');
    //   const fileUrl = await uploadFileToStorage(file);
    //   messageData = { fileUrl };
    // } else {
    //   // Handle string message
    //   messageData = { text: message };
    // }

    // await Message.create(messageData);
    // console.log('New message:', message);
    const read = [];
    const ids = mongoose.Types.ObjectId();
    ChatUser.aggregate([
      { 
        $match: { logined: true } 
      },
      {
        $project: { 
          _id: 0, 
          username: 1,
          avatar: 1
        }
      }
    ], function (err, result) {
      if (err) {
        // Handle error
      } else {
        // console.log(result);
        // Process the result
        result.map((item, index)=> {
          // console.log(message.username);
          if(item.username != message.username) read.push(item.username)
        })
        console.log(message.username, message.message);
        const newMessage = new Chat({
          id: ids,
          userName: message.username,
          avatar: message.avatar,
          message: message.message,
          image: message.image,
          timestamp: new Date(), // Save the current server time to the database
          readed: read
        });
        newMessage.save().then((data) => {
          console.log('Successfully Created!');
        });
        
        // const messages = Chat.find({});
        io.emit('message', newMessage);
      }
    });
    ChatUser.aggregate([
      { 
        $match: { logined: false } 
      },
      {
        $project: { 
          _id: 0, 
          username: 1,
          unreadmsg: 2
        }
      }
    ], function (err, result) {
      if (err) {
        // Handle error
      } else {
        // console.log(result);
        // Process the result
        result.map(async(item, index)=> {
        // console.log(message.username);        
          const filter = { username: item.username };
          const update = { unreadmsg: [...item.unreadmsg, ids ] };
          const users = await ChatUser.updateOne(filter, update);
          // const updateUser = ChatUser.updateOne({ username: item.username }, { $push: { unreadmsg: message._id } })
          const user = await ChatUser.findOne({username: item.username});
          io.emit('Alert', {walletAddress: user.walletAddress, alert: user.unreadmsg.length});
        
        console.log('up', user);
      })
      // // console.log(read);
      // const newMessage = new Chat({
      //   userName: message.username,
      //   message: message.message,
      //   timestamp: new Date(), // Save the current server time to the database
      //   readed: read
      // });
      // newMessage.save();
      // // const messages = Chat.find({});
      // io.emit('message', newMessage);
      }
    });
    // console.log('message: ', message);
    
  });
  
  socket.on('upload', (message) => {
    const read = [];
    const ids = mongoose.Types.ObjectId();
    ChatUser.aggregate([
      { 
        $match: { logined: true } 
      },
      {
        $project: { 
          _id: 0, 
          username: 1,
          avatar: 2
        }
      }
    ], function (err, result) {
      if (err) {
        // Handle error
      } else {
        // console.log(result);
        // Process the result
      result.map((item, index)=> {
        // console.log(message.username);
        if(item.username != message.username) read.push(item.username)
      })
      // console.log(read);
      const newMessage = new Chat({
        id: ids,
        userName: message.username,
        avatar: message.avatar,
        message: message.message,
        timestamp: new Date(), // Save the current server time to the database
        readed: read
      });
      newMessage.save();
      
      // const messages = Chat.find({});
      io.emit('message', newMessage);
      }
    });
    ChatUser.aggregate([
      { 
        $match: { logined: false } 
      },
      {
        $project: { 
          _id: 0, 
          username: 1,
          unreadmsg: 2
        }
      }
    ], function (err, result) {
      if (err) {
        // Handle error
      } else {
        // console.log(result);
        // Process the result
        result.map(async(item, index)=> {
        // console.log(message.username);        
          const filter = { username: item.username };
          const update = { unreadmsg: [...item.unreadmsg, ids ] };
          const users = await ChatUser.updateOne(filter, update);
          // const updateUser = ChatUser.updateOne({ username: item.username }, { $push: { unreadmsg: message._id } })
          const user = await ChatUser.findOne({username: item.username});
          io.emit('Alert', {walletAddress: user.walletAddress, alert: user.unreadmsg.length});
        
        console.log('up', user);
      })
      // // console.log(read);
      // const newMessage = new Chat({
      //   userName: message.username,
      //   message: message.message,
      //   timestamp: new Date(), // Save the current server time to the database
      //   readed: read
      // });
      // newMessage.save();
      // // const messages = Chat.find({});
      // io.emit('message', newMessage);
      }
    });
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server is running on port ${PORT}`);
});