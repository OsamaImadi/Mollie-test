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

// app.get("/:id", (req, res) => {
//   mollie.payments
//     .get(req.params.id)
//     .then(payment => {
//       console.log("recieved payment:", payment);
//       // E.g. check if the payment.isPaid()
//     })
//     .catch(err => {
//       console.log("error: ", err);
//       // Handle the error
//     });
// });

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
      } else if (!payment.isOpen()) {
        console.log("The payment is not yet paid");
        // The payment isn't paid and has expired. We can assume it was aborted.
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
// //test_mrd5J9kSPqTQUxe2AtJgPSFzpm2KS5
// const express = require("express");

// const mollie = require("@mollie/api-client")({
//   apiKey: "test_mrd5J9kSPqTQUxe2AtJgPSFzpm2KS5"
// });

// const app = express();

// app.get("/", (req, res) => {
//   //   const orderId = new Date().getTime();
//   mollie.payments
//     .create({
//       amount: {
//         value: "10.00",
//         currency: "EUR"
//       },
//       description: "My first API payment",
//       redirectUrl: "https://yourwebshop.example.org/order/123456",
//       webhookUrl: "https://yourwebshop.example.org/webhook"
//     })
//     .then(payment => {
//       //console.log("payment: ", payment);
//       // Forward the customer to the payment.getPaymentUrl()
//       mollie.payments
//         .get(payment.id)
//         .then(payment => {
//           console.log(payments);
//           // E.g. check if the payment.isPaid()
//         })
//         .catch(err => {
//           console.log("error: ", err);
//           // Handle the error
//         });
//     })
//     .catch(err => {
//       console.log("error: ", err);
//       // Handle the error
//     });
// });

// const express = require("express");
// const mollieClient = require("@mollie/api-client")({
//   apiKey: "test_mrd5J9kSPqTQUxe2AtJgPSFzpm2KS5"
// });

// const app = express();
// // const mollieClient = createMollieClient({
// //   apiKey: "test_mrd5J9kSPqTQUxe2AtJgPSFzpm2KS5"
// // });

// app.get("/", (req, res) => {
//   const orderId = new Date().getTime();

//   mollieClient.payments
//     .create({
//       amount: { value: "0.00", currency: "USD" },
//       description: "New payment",
//       redirectUrl: `https://example.org/redirect?orderId=${orderId}`,
//       webhookUrl: `http://example.org/webhook?orderId=${orderId}`,
//       metadata: { orderId }
//     })
//     .then(payment => {
//       // Redirect the consumer to complete the payment using `payment.getPaymentUrl()`.
//       res.redirect(payment.getPaymentUrl());
//     })
//     .catch(error => {
//       // Do some proper error handling.
//       res.send(error);
//     });
// });

// app.post("/webhook", (req, res) => {
//   mollieClient.payments
//     .get(req.body.id)
//     .then(payment => {
//       if (payment.isPaid()) {
//         // Hooray, you've received a payment! You can start shipping to the consumer.
//       } else if (!payment.isOpen()) {
//         // The payment isn't paid and has expired. We can assume it was aborted.
//       }
//       res.send(payment.status);
//     })
//     .catch(error => {
//       // Do some proper error handling.
//       res.send(error);
//     });
// });

// app.get("/webhook", (req, res) => {
//   res.send("Get webhook");
// });

// app.get("/redirect", (req, res) => {
//   res.send("Get redirect");
// });

// mollieClient.payments
//   .get(payment.id)
//   .then(payment => {
//     console.log("payment: ", payments);
//   })
//   .catch(err => {
//     console.log(err);
//     // Handle the error
//   });
