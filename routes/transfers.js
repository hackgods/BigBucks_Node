const express = require("express");
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();
require('dotenv').config();
const fetch = require("node-fetch");
const User = require('./schemas/userschema.js');
const Transactions = require('./schemas/transactionschema.js');

const { response } = require("express");



mongoose.connect("mongodb://localhost:27017/big_bucks_db", { useNewUrlParser: true });



async function exchangeRate(currFrom, currTo, currAmt) {

    let xchangeResult;
    var myHeaders = new fetch.Headers();
    myHeaders.append("apikey",process.env.EXCHANGE_API_KEY);
    var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};
   xchangeResult = await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${currTo}&from=${currFrom}&amount=${currAmt}`, requestOptions).catch(error => console.log('error', error));
   let xchangeResultJson = await xchangeResult.json();
   return xchangeResultJson;
} 


//home of transfers api
router.get("/",(req,res) => {
    //exchangeRate('INR','GBP','150');
    res.send("Transfer Home");
});

router.post("/sendtophone",async (req,res) => {
    const userId = req.body.cardId;
    const userPassword = req.body.password;
    const toPhone = req.body.toPhone;
    const sendAmt = req.body.sendAmt;

    let xchangeData;

    let currencyRate;
    let convertedAmt = 0;
    let userBalance = 0;
    let userCurrency = "QWE";

    let recipientCurrency = "QWE";
    let recipientBalance = 0;
    let recipientId = 0;
    

    if(userId != null && userPassword!= null && toPhone!= null && sendAmt!=null) {
        async function getUserData() {
            const doc = await User.findOne({cardId: userId,password: userPassword}).exec();
            if(doc!=null) {
                userBalance = doc.balanceAmt;
                userCurrency = doc.currency;
                //console.log(userBalance+userCurrency);
            } else {
                
            }
          };
    
          
          await getUserData();

          if(userBalance > sendAmt) {
            async function getRecipientData() {
                const doc = await User.findOne({phoneNumber: toPhone}).exec();
                if(doc!=null) {
                    recipientCurrency = doc.currency;
                    recipientBalance = doc.balanceAmt;
                    recipientId = doc.cardId;
                } else {
                    
                }
              };
        
              await getRecipientData();
        
              xchangeData = await exchangeRate(userCurrency,recipientCurrency,sendAmt);
        
              convertedAmt = xchangeData['result'];

              currencyRate = xchangeData['info']['rate'];

              console.log(xchangeData);

              console.log(` Rate: ${currencyRate} ${recipientId}`);

              console.log(`You ${userId} are sending ${convertedAmt} ${recipientCurrency} to ${toPhone}`);
        
              recipientBalance += convertedAmt;
        
              console.log(recipientBalance);
              
              User.updateOne({phoneNumber: toPhone}, {"balanceAmt":recipientBalance}, function(err)
             {
                if(err) {
                    console.log(err);
                    res.status(400).send(`ERROR ${err}`);
                } else {
                    console.log("Money Transferred");
                    res.status(200).send(`Money Transferred`);
                }
            });

            userBalance -=sendAmt;

            User.updateOne({cardId: userId}, {"balanceAmt":userBalance}, function(err)
             {
                if(err) {
                    console.log(err);
                    res.status(400).send(`ERROR ${err}`);
                } else {
                    
                }
            });

            const txnId = Math.floor(Math.random() * 100000000000);

            const txn = new Transactions({
                txnId: txnId,
                fromAcc: userId,
                toAcc: recipientId,
                amt: sendAmt,
                fromCurrency: userCurrency,
                toCurrency: recipientCurrency,
                rate: currencyRate,
                timestamp: Date.now()
            });
        
            txn.save();

          } else {
            res.status(400).send("No Balance");
          }




    } else {
        res.status(400).send("Please enter all params");
    }


});


router.post("/recenttransactions",async (req,res) => {
    const userId = req.body.cardId;
    const userPassword = req.body.password;
    const txntype = req.body.txntype;

    async function check() {
        const doc = await User.findOne({cardId: userId,password: userPassword}).exec();
        if(doc!=null) {
            
            const sort = {timestamp: -1};
            
            if(txntype=="debit") {
                const doc1 = await Transactions.find({fromAcc: doc.cardId}).sort(sort).exec();
            console.log(doc1);
            res.status(200).send(doc1);
            } else if (txntype=="credit") {
            const doc1 = await Transactions.find({toAcc: doc.cardId}).sort(sort).exec();
            console.log(doc1);
            res.status(200).send(doc1);

            }
        } else {
            res.status(400).send("Check card id and password");
        }
      };

      check();


});


router.post("/getname",async (req,res) => {
    const userId = req.body.cardId;
    

    async function check() {
        const doc = await User.findOne({cardId: userId}).exec();
        if(doc!=null) {
            
            const username = `${doc.firstName} ${doc.lastName}`;

            res.status(200).send(username);
            
        } else {
            res.status(400).send("Check card id");
        }
      };

      check();


});


//1533586138





module.exports = router;



