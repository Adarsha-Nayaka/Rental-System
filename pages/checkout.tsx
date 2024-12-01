import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from 'C:/Users/kadar/Downloads/Rental System/app/components/CheckoutForm'; // Use relative import

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(5000); // Example total amount, replace with dynamic data
  const [loading, setLoading] = useState<boolean>(true); // Handle loading state
  const [error, setError] = useState<string | null>(null); // Handle error state
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false); // Handle payment success state

  useEffect(() => {
    // Fetch client secret from the backend
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalAmount, currency: 'usd' }), // Replace with dynamic data
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load payment intent. Please try again.');
        setLoading(false);
      });
  }, [totalAmount]);

  // Handle payment success callback from CheckoutForm
  const handlePaymentSuccess = () => {
    setPaymentSuccess(true);
  };

  return (
    <div>
      <h1>Checkout</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm clientSecret={clientSecret} totalAmount={totalAmount} onPaymentSuccess={handlePaymentSuccess} />
        </Elements>
      ) : (
        <p>Unable to initialize payment. Please try again.</p>
      )}

      {/* Show success message if payment was successful */}
      {paymentSuccess && <p>Payment Successful! Thank you for your purchase.</p>}
    </div>
  );
};

export default CheckoutPage;
