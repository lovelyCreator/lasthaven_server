const jwtEncode = require('jwt-encode')
const db = require("../models");
const ChatUser = db.chatusers
const Chat = db.chats
const secret = 'secret';

exports.wallet = async (req, res) => {
    const { walletAddress } = req.body;
    // console.log(req.body);
    try {
        const existingUser = await ChatUser.findOne({ walletAddress:walletAddress });
        // console.log('user: ', existingUser)
        if (existingUser) {
            // const updateUser = ChatUser.updateOne({username:username, logined: true});
            // console.log('log', updateUser.logined);
            // console.log('user', existingUser.logined);
            const filter = { username: existingUser.username };
            const update = { logined: true };
            const result = await ChatUser.updateOne(filter, update);
            // console.log('result', result);
            // console.log(existingUser);
            return res.status(200).json({isWalletLogin: 'true', username: existingUser.username});
        }
        else {
            // console.log('loges');
            return res.status(200).json({ isWalletLogin: false });
        }
    } catch( error ) {
        res.status(500).json({ message: 'An error occurred'});
    }
}
// Create and Save a new user
exports.create = async (req, res) => {
    const { username, walletAddress } = req.body;
    console.log(username, walletAddress)
    try {
        const existingUser = await ChatUser.findOne({ username:username });
        console.log(existingUser);
        if (existingUser) {
            const updateUser = ChatUser.updateOne({username:username, logined: true})
            console.log('log', updateUser.logined);
            return res.status(400).json({ message: 'Username is already taken'});
        }
        const newUser = new ChatUser({ username:username, walletAddress: walletAddress, logined: true, unread });
        console.log(newUser);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (e) {
        res.status(500).json({ message: 'An error occurred'});
    }
};

exports.getMessage = async (req, res) => {
    // const { username } = req.body;
    // console.log(username)
    try {
        const AllMessages = await Chat.find({});
        // console.log(AllMessages);
        if (!AllMessages) {
            return res.status(400).json({ message: "No messages"});
        }
       return res.status(200).json({message: AllMessages}) ;
    } catch (e) {
        res.status(500).json({ message: 'An error occurred'});
    }
};


// exports.login = async (req, res) => {
//   const iat = req.body.time
//   const exp = req.body.time + 600

//   User.find({ email: req.body.email })
//     .then((data) => {
//       if (data.length === 0) {
//         res.send('There is no user')
//       } else if(data[0].password !== req.body.password){
//         res.send('Wrong Password')
//       }
//        else {
//         const userId = data[0].id
//         const serviceToken = jwtEncode({
//           userId: userId,
//           iat: iat,
//           exp: exp
//         }, secret)
//         const user = {
//           email: data[0].email,
//           id: data[0]._id,
//           name:`${data[0].firstName} ${data[0].lastName}`,
//           userId: data[0].userId,
//           authToken: data[0].authToken
//         }
//         const response = {
//           serviceToken:serviceToken,
//           user:user
//         }
//         res.send(response)
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while retrieving spots.",
//       });
//     });

// };
