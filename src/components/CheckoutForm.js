import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import Swal from "sweetalert2";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const alterMessage = (paymentIntent) => {
    let message;
    let statusIcon = "error";
    switch (paymentIntent.status) {
      case "succeeded":
        message = "Success! Payment received.";
        statusIcon = "success";
        break;

      case "processing":
        message =
          "Payment processing. We'll update you when payment is received.";
        break;

      case "requires_payment_method":
        // Redirect your user back to your payment page to attempt collecting
        // payment again
        message = "Payment failed. Please try another payment method.";
        break;

      default:
        message = "Something went wrong.";
        break;
    }
    Swal.fire({
      icon: statusIcon,
      text: message,
    });
  };

  const handleSubmit = async (event) => {
    // set loading start
    setIsLoading(true);

    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setIsLoading(false);
      return;
    }

    const StripePayment = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (StripePayment.error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(StripePayment.error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      alterMessage(StripePayment.paymentIntent);
    }
    setIsLoading(false);
    elements.getElement("payment").clear();
  };

  return (
    <>
      <div>CheckoutForm</div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            width: "50%",
            margin: "30px auto",
            border: "1px solid green",
            padding: "30px 100px",
          }}
        >
          <h1>Payment Element</h1>
          <PaymentElement />
        </div>
        <button disabled={!stripe}>Submit</button>
        {isLoading ? <h3>Loading ...</h3> : ""}
        {/* Show error message to your customers */}
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
      </form>
    </>
  );
};

export default CheckoutForm;
