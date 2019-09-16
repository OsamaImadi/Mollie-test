const { createMollieClient } = require("@mollie/api-client");
const mollie = createMollieClient({
  apiKey: "test_mrd5J9kSPqTQUxe2AtJgPSFzpm2KS5"
});
var cors = require("cors");
var bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.get("/redirect", (req, res) => {
  console.log("Inside redirect: ", req.body);
  res.send("redirected");
});

app.post("/create", (req, res) => {
  // const orderId = new Date().getTime();
  // console.log(req.body);
  mollie.payments
    .create({
      amount: {
        value: req.body.value,
        currency: req.body.currency
      },
      description: req.body.description,
      redirectUrl: "https://mollie-test-app.herokuapp.com/redirect",
      webhookUrl: "https://mollie-test-app.herokuapp.com/webhook"
    })
    .then(payment => {
      // res.status(200).send(payment);
      console.log(payment);
      // res.redirect(payment.getPaymentUrl());
      res.json({ url: payment.getPaymentUrl() });

      // Forward the customer to the payment.getPaymentUrl()
    })
    .catch(err => {
      res.send(err);
      // Handle the error
    });
});

app.get("/:id", (req, res) => {
  mollie.payments
    .get(req.params.id)
    .then(payment => {
      console.log("recieved payment:", payment);
      res.send(payment);
      // E.g. check if the payment.isPaid()
    })
    .catch(err => {
      console.log("error: ", err);
      res.send(err);
      // Handle the error
    });
});

app.post("/webhook", (req, res) => {
  console.log("Inside webhook: ", req.body);
  // console.log("Inside webhook=====================");
  mollie.payments
    .get(req.body.id)
    .then(payment => {
      if (payment.isPaid()) {
        console.log("The payment was recieved");
        // res.redirect("");
        // Hooray, you've received a payment! You can start shipping to the consumer.
      } else if (payment.isOpen()) {
        console.log("The payment is open");
        // The payment isn't paid and has expired. We can assume it was aborted.
      } else if (payment.isCanceled()) {
        console.log("The payment was cancelled");
      } else if (payment.isFailed()) {
        console.log("The payment failed");
      } else if (payment.isExpired()) {
        console.log("Payment expired");
      }
      res.send(payment);
    })
    .catch(error => {
      // Do some proper error handling.
      res.send(error);
    });
});
const port = process.env.PORT || 8000;
app.listen(port, () => console.log("Example app listening on port: ", port));
