import React, { useContext } from "react";
import { useState } from "react";
import Layout from "./common/Layout";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "./context/Cart";
import { useForm } from "react-hook-form";
import { apiUrl, userToken } from "./common/http";
import { toast } from "react-toastify";
import CheckoutForm from "./CheckoutForm";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
const stripePromise = loadStripe("STRIPE_PUBLIC_KEY");

const Checkout = () => {
  return (
    <Layout>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Layout>
  );
};

export default Checkout;
