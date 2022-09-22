const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./schemas/userschema.js');




mongoose.connect("mongodb://localhost:27017/big_bucks_db", { useNewUrlParser: true });


//todays date ddmmyyyy
const today = new Date();
const yyyy = today.getFullYear();
let mm = today.getMonth() + 1; // Months start at 0!
let dd = today.getDate();
if (dd < 10) dd = '0' + dd;
if (mm < 10) mm = '0' + mm;
const formattedToday = yyyy + '-' + mm + '-' + dd;


//home of user api
router.get("/",(req,res) => {
    res.send("Hello User");
});


//create new user
router.post("/new",(req,res) => {

    const userReq = req.body;
    const cardID = Math.floor(Math.random() * 10000000000);

    const user = new User({
        ...userReq,
        cardId: cardID,
        createdDate: formattedToday,
    });

    user.save();
    
    res.send(`User added to database`);
});

//update user data
router.post("/update",(req,res) => {

    const userID = req.body.cardId;
    const userPass = req.body.password;
    const userReq = req.body;
    
    User.updateOne({cardId: userID,password: userPass}, {...userReq}, function(err)
    {
        if(err) {
            console.log(err);
        } else {
            console.log("Updated");
            res.send(`User updated`);
        }
    });

});

//login user data
router.post("/login",(req,res) => {
    const userId = req.body.cardId;
    const userPass = req.body.passcode;

    async function getUserData() {
        const doc = await User.findOne({cardId: userId,passcode: userPass}).exec();
        if(doc!=null) {
            res.status(200).send(doc);
        } else {
            res.status(400).send("Check card id and password");
        }
      };

      getUserData();

});



//check user data exist
router.post("/exist/:id",(req,res) => {
    const { id } = req.params;
    let exist = false;

    async function getUserData() {
        const doc = await User.findOne({cardId: id,phoneNumber: id}).exec();
        if(doc!=null) {
            exist = true;
            res.send(exist);
        } else {
            exist = false;
            res.send(exist);
        }
      };

      getUserData();

});


module.exports = router;
/*router.post("/",(req,res) => {

    const user = req.body;
    const userID = uuidv4();

    userList.push({...user,id: userID});
    console.log(user);
    

    res.send(`User added to database`);
});


router.get("/:id",(req,res) => {
    const { id } = req.params;

    const findUser = userList.find((user) => user.id === id );

    res.send(findUser);
});
*/


