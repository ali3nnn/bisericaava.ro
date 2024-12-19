import React, { useEffect } from "react";

const StripeButton = () => {
  useEffect(() => {
    // Dynamically load the Stripe Buy Button script
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/buy-button.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup the script from the DOM when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <stripe-buy-button
        buy-button-id="buy_btn_1QXfATDkjbxnO7r8eUMIXBxk"
        publishable-key="pk_live_51QXQj0DkjbxnO7r8LvGpYRPpGVan1Cszpky34agWZZQBtE9b52gzzASa8e2SIGGKRJ6r15czfgWliwTYydB8FU8M00tEkBIo8K"
      ></stripe-buy-button>
    </div>
  );
};

export default StripeButton;
