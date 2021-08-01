const functions = require("firebase-functions");

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const paypal = require("paypal-rest-sdk")
const url = require("url");
const { json } = require("body-parser");

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AVgk4Blak5Zh1JyXlb30Dnhu9zflsp5eOqnilAaUTZEt7qaiINyJPhUQwRp4ThWhM3MQbQnLTvFJcsF9',
  'client_secret': 'EKck4sZ9NgYStHO0qtEKXpRx6czFWbiiBGqUvlrcSDQSMsmcQSd12HoOX4rPhQru9xHCsJmxQzpodXpk'
});


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.json());
app.use(cors());
app.set("view engine", ejs);
app.use("/static", express.static(__dirname + "/views"));

const PORT = process.env.PORT || 8000;
const HOST=process.env.HOST

app.get('/', (req, res) => {
    
    res.send("Welcome firebase function for paypal payment")
})

let toPayAmount = 5;
//let origin = null;

app.post("/payment", (req, res) => {
    toPayAmount = req.body.amount;
    origin = req.body.origin;
    console.log("req.body",req.body)

    let create_payment_json = {
        "intent": "SALE",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `${HOST}:${PORT}/success`,
            "cancel_url": `${HOST}:${PORT}/cancel`
        },
        "transactions": [{
            // "item_list": {
            //     "items": [{
            //         "name": "item",
            //         "sku": "item",
            //         "price": `${toPayAmount}`,
            //         "currency": "USD",
            //         "quantity": 1
            //     }]
            // },
            "amount": {
                "currency": "USD",
                "total": `${toPayAmount}`
            },
            "description": "This is the payment description."
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
        throw error;
    } else {
        console.log("Create Payment Response");
        console.log(payment);
        let redirectURLObject = payment.links.find((link) => link.rel === 'approval_url')
        res.redirect(redirectURLObject.href);
    }
});
})

app.get("/success", (req, res) => {
    console.log("req.query", req.query)
    console.log("req.body",req.body)
    console.log("req.prams", req.params)
   
    let payerID = req.query.PayerID;
    let paymentID = req.query.paymentId;
    let token = req.query.token;

    let payment_execute_json = {
        payer_id: payerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total:`${toPayAmount}`
                }
            }
        ]
    }

    paypal.payment.execute(paymentID, payment_execute_json, (error, payment) => {
        if (error) {
            console.log("Error",error)
        }
        console.log(payment.transactions[0].related_resources[0].authorization)


        res.json(payment);
    })

})

app.get("/cancel", (req, res) => {
    console.log("req.query", req.query)
    console.log("req.body",req.body)
    console.log("req.prams",req.params)
    res.json("Failed");
})




app.listen(PORT, (err) => {
    if (!err) {
        console.log(`Server is up and runing on ${HOST}:${PORT} `)
        return
    }
    
    console.log("Server is down. Error in Starting the server.")
})

exports.app = functions.https.onRequest(app);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


