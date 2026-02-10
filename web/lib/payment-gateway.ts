export const initiatePayment = async (amount: number, currency: string = "INR") => {
    console.log(`[PAYMENT_MOCK] Initiating payment of ${amount} ${currency}`);

    // In production, this would use Razorpay or Stripe
    // const order = await razorpay.orders.create({ amount: amount * 100, currency });

    return { success: true, orderId: "order_mock_" + Date.now() };
};

export const verifyPayment = async (paymentId: string, signature: string) => {
    console.log(`[PAYMENT_MOCK] Verifying payment ${paymentId}`);
    return { success: true };
};
