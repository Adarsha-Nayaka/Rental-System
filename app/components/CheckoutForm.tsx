import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

interface CheckoutFormProps {
  clientSecret: string;
  totalAmount: number;
  onPaymentSuccess: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  clientSecret,
  totalAmount,
  onPaymentSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded.
    }

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message || "An error occurred.");
      } else if (paymentIntent?.status === "succeeded") {
        onPaymentSuccess(); // Notify the parent component about payment success
      } else {
        setError("Payment failed. Please try again.");
      }
    }
    setProcessing(false);
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Complete Your Payment</h2>
      <p className="text-lg text-center text-gray-700 mb-4">
        Total Amount: <span className="text-2xl font-semibold text-gray-900">₹{totalAmount}</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Input Section */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
          <CardElement
            options={{
              style: {
                base: {
                  color: "#333",
                  fontSize: "16px",
                  fontFamily: "'Roboto', sans-serif",
                  fontWeight: "400",
                  "::placeholder": {
                    color: "#ccc",
                  },
                },
                invalid: {
                  color: "#e74c3c",
                },
              },
            }}
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-600 text-center text-sm">{error}</p>}

        {/* Submit Button */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={processing || !stripe}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold rounded-md hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-400 transition"
          >
            {processing ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </form>

      {/* Footer with Additional Info */}
      <div className="text-center mt-6 text-gray-500 text-sm">
        <p>By completing this payment, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
    </div>
  );
};

export default CheckoutForm;
