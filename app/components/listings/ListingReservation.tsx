'use client';

import { Range } from "react-date-range";
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import Button from "../Button";
import Calendar from "../inputs/Calendar";
import Modal from "../Modal"; // Import the Modal component
import CheckoutForm from "../CheckoutForm"; // Import the updated CheckoutForm

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "your-fallback-key");

interface ListingReservationProps {
  price: number;
  dateRange: Range;
  totalPrice: number;
  securityDeposit: number;
  onChangeDate: (value: Range) => void;
  onSubmit: () => void;
  disabled?: boolean;
  disabledDates: Date[];
}

const ListingReservation: React.FC<ListingReservationProps> = ({
  price,
  dateRange,
  totalPrice,
  onChangeDate,
  onSubmit,
  securityDeposit,
  disabled,
  disabledDates,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // New state for payment success

  const handleFirstFunction = async () => {
    console.log("First function called");

    const totalWithDeposit = totalPrice + securityDeposit;

    // Fetch the PaymentIntent client secret from the backend
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: totalWithDeposit * 100, // Convert to smallest currency unit
        currency: "inr", // INR for Indian Rupee
      }),
    });

    const data = await response.json();

    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      setIsModalOpen(true); // Open the modal
      console.log("Payment interface initialized");
      return true;
    } else {
      console.error("Failed to create PaymentIntent");
      return false;
    }
  };

  const handleClick = async () => {
    const isPaymentInitialized = await handleFirstFunction();
    if (isPaymentInitialized) {
      console.log("Payment initiated");
    } else {
      console.log("Payment not initiated");
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true); // Set payment success state
    console.log("Payment successful!");
  };

  return (
    <div
      className="bg-white rounded-xl border-[1px] border-neutral-200 overflow-hidden"
    >
      {/* Price Section */}
      <div className="flex flex-row items-center gap-1 p-4">
        <div className="text-2xl font-semibold">₹ {price}</div>
        <div className="font-light text-neutral-600">/ day</div>
      </div>
      <hr />

      {/* Calendar Section */}
      <Calendar
        value={dateRange}
        disabledDates={disabledDates}
        onChange={(value) => onChangeDate(value.selection)}
      />
      <hr />

      {/* Price Breakdown Section */}
      <div className="p-4">
        <div className="flex flex-row items-center justify-between">
          <div className="text-lg font-medium">Base Price</div>
          <div className="text-lg font-medium">₹ {totalPrice}</div>
        </div>
        <div className="flex flex-row items-center justify-between mt-2">
          <div className="text-lg font-medium">Security Deposit</div>
          <div className="text-lg font-medium">₹ {securityDeposit}</div>
        </div>
        <hr className="my-2" />
        <div className="flex flex-row items-center justify-between font-semibold text-lg">
          <div>Total Amount</div>
          <div>₹ {totalPrice + securityDeposit}</div>
        </div>
      </div>
      <hr />

      {/* Booking Button */}
      <div className="p-4">
        <Button disabled={disabled} label="Book" onClick={handleClick} />
      </div>

      {/* Payment Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {paymentSuccess ? (
          <div className="p-4">
            <h2 className="text-green-600 font-semibold">Payment Successful!</h2>
            <p>Your booking has been confirmed. Thank you for your payment.</p>
            <Button label="Close" onClick={() => {setIsModalOpen(false); onSubmit();}} />
          </div>
        ) : (
          clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe", // Default Stripe theme
                  variables: {
                    colorPrimary: "#0570de",
                    colorBackground: "#f6f9fc",
                    colorText: "#30313d",
                    borderRadius: "10px",
                  },
                },
              }}
            >
              <CheckoutForm
                clientSecret={clientSecret}
                totalAmount={totalPrice + securityDeposit}
                onPaymentSuccess={handlePaymentSuccess} // Pass the success handler
              />
            </Elements>
          )
        )}
      </Modal>
    </div>
  );
};

export default ListingReservation;

