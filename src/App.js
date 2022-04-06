import { useState, useEffect } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./components/CheckoutForm";
import axios from "axios";
import env from "react-dotenv";
import "./App.css";

const stripePromise = loadStripe(env.PUBLISHABLE_KEY);
function App() {
  const [clientSecret, setClientSecret] = useState("");

  // get cilent secret from the server
  useEffect(() => {
    const getClientSecret = async () => {
      try {
        const clientSecret = await axios.get(
          "http://localhost:8080/strip-secret-create"
        );
        setClientSecret(clientSecret.data.client_secret);
      } catch (err) {
        console.log("error to get secret key", err);
      }
    };
    getClientSecret();
  }, []);

  const options = {
    clientSecret: clientSecret,
  };
  return (
    <div className="App">
      <h1>Strip Integeration</h1>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm clientSecret={clientSecret} />
        </Elements>
      )}
    </div>
  );
}

export default App;
